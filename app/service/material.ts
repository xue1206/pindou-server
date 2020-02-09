import {Service} from 'egg';
import {User} from '../entity/user'
import Collection from '../../utils/Collection';
import { Material } from '../entity/material';

interface PageInfo<T = null> {
  pn: number,
  ps: number,
  ext: T
}

interface MaterialSqlResponse {
  materialId: number,
  materialTitle: string,
  materialDescription: string,
  fileId: number,
  filePath: string,
  fileName: string,
  categoryId: number,
  categoryName: string,
  coverId: number,
  coverFileName: string,
  coverFilePath: string,
  materialBackground: string,
  userId: number,
  userName: string,
  userEmail: string,
}

class UserService extends Service {
  async select(params: any): Promise<User[]> {
    const { name, email, pageNo = 0, pageSize = 10 } = params;
    const where = this.ctx.helper.filterNotNull({ name, email });
    const res = await this.app.mapper.user.select({
      where, // WHERE 条件
      columns: [ 'name', 'email' ], // 要查询的表字段
      orders: [[ 'id', 'desc' ]], // 排序方式
      limit: pageSize, // 返回数据量
      offset: pageNo * pageSize,
    });
    return res;
  }

  async create(params: Material) {
    return await this.app.mysql.beginTransactionScope(async (conn: any) => {
      const {title, description, files, users, categoryId, coverId, background} = params;
      const insertedMaterialRes = await conn.insert('material', {
        title,
        description,
        categoryId,
        coverId,
        background,
      });
      await conn.insert('material_file', files.map(file => (
        {
          materialId: insertedMaterialRes.insertId,
          fileId: file.id,
        }
      )));
      await conn.insert('user_material', users.map(user => (
        {
          materialId: insertedMaterialRes.insertId,
          userId: user.id,
        }
      )));
      return { status: 200 };
    }, this.ctx);
  }

  async updateMaterial(id: number, material: Material) {
    return await this.app.mysql.beginTransactionScope(async (conn: any) => {
      const {title, description, files, users, categoryId, coverId, background} = material;
      await conn.update('material', {
        id,
        title,
        description,
        categoryId,
        coverId,
        background,
      });
      await conn.delete('material_file', {
          materialId: id,
        }
      );
      await conn.insert('material_file', files.map(file => (
        {
          fileId: file.id,
          materialId: id,
        }
      )));
      await conn.delete('user_material', {
        materialId: id,
      }
    );
      await conn.insert('user_material', users.map(user => (
        {
          userId: user.id,
          materialId: id,
        }
      )));
      return { status: 200 };
    }, this.ctx);
  }

  async delete(id: number) {
    return await this.app.mysql.beginTransactionScope(async (conn: any) => {
      await conn.delete('material_file', {
        materialId: id,
      });
      await conn.delete('user_material', {
        materialId: id,
      });
      await conn.delete('hot', {
        materialId: id,
      });
      await conn.delete('material', {
        id,
      });
      return { status: 200 };
    }, this.ctx);
  }

  async getMaterial(where: string, query: (string|number)[]) {
    const sqlRes = await this.app.mapper.material.query(`
    SELECT * FROM(
      SELECT
        pindou.material.id as materialId,
        pindou.material.title as materialTitle,
        pindou.material.description as materialDescription,
        pindou.material.background as materialBackground,
        tmp_f.id as fileId,
        tmp_f.fileName as fileName,
        tmp_f.filePath as filePath,
        pindou.category.name as categoryName,
        categoryId,
        coverId,
        tmp_c.fileName as coverFileName,
        tmp_c.filePath as coverFilePath,
        tmp_u.name as userName,
        tmp_u.id as userId,
        tmp_u.email as userEmail
        FROM pindou.material
        LEFT JOIN pindou.category ON pindou.material.categoryId = pindou.category.id
        LEFT JOIN pindou.file tmp_c ON pindou.material.coverId = tmp_c.id
        LEFT JOIN pindou.material_file ON pindou.material.id = pindou.material_file.materialId
        LEFT JOIN pindou.file tmp_f ON tmp_f.id = pindou.material_file.fileId
        LEFT JOIN pindou.user_material ON pindou.material.id = pindou.user_material.materialId
        LEFT JOIN pindou.user tmp_u ON pindou.user_material.userId = tmp_u.id
        ORDER BY materialId DESC
    )total
    WHERE ${where};
    `, query) as MaterialSqlResponse[];
    const colletions = new Collection<number, MaterialSqlResponse>(sqlRes, item => item.materialId);
    const res: Material[] = [];
    colletions.toArray().forEach((value) => {
      const {materialId, materialDescription, materialTitle, categoryId, categoryName, coverId, coverFileName, coverFilePath, materialBackground} = value[0];
      const m: Material = {
        id: materialId,
        title: materialTitle,
        description: materialDescription,
        files: [],
        users: [],
        category: {
          id: categoryId,
          name: categoryName,
        },
        cover: {
          id: coverId,
          fileName: coverFileName,
          filePath: coverFilePath,
        },
        background: materialBackground,
      };
      m.files = value.map(item => ({
        id: item.fileId,
        filePath: item.filePath,
        fileName: item.fileName,
      }));
      m.users = value.map(item => ({
        id: item.userId,
        name: item.userName,
        email: item.userEmail,
      }));
      res.push(m);
    })

    return res

  }

  async getById(id: string | number) {
    const list = await this.getMaterial(`
      total.materialId = ?
    `, [id]);
    return list[0];
  }

  async getList(pageInfo: PageInfo<{title: string, description: string}>) {
    const {pn, ps,} = pageInfo;
    return this.getMaterial(`
      total.materialId IN (
        SELECT * FROM (SELECT id as materialId FROM pindou.material LIMIT ?, ?)tmp
      )
    `, [pn * ps, ps]);
  }

  async getHotList() {
    const sqlRes = await this.app.mapper.material.query(`
    SELECT
    pindou.material.id as materialId,
    pindou.material.title as materialTitle,
    pindou.material.description as materialDescription,
    pindou.material.background as materialBackground,
    tmp_f.id as fileId,
    tmp_f.fileName as fileName,
    tmp_f.filePath as filePath,
	pindou.category.name as categoryName,
    categoryId,
    coverId,
    tmp_c.fileName as coverFileName,
    tmp_c.filePath as coverFilePath,
    tmp_u.name as userName,
    tmp_u.id as userId,
    tmp_u.email as userEmail
    FROM pindou.hot
    LEFT JOIN pindou.material ON pindou.hot.materialId = pindou.material.id
	LEFT JOIN pindou.category ON pindou.material.categoryId = pindou.category.id
	LEFT JOIN pindou.file tmp_c ON pindou.material.coverId = tmp_c.id
    LEFT JOIN pindou.material_file ON pindou.material.id = pindou.material_file.materialId
  LEFT JOIN pindou.file tmp_f ON tmp_f.id = pindou.material_file.fileId
  LEFT JOIN pindou.user_material ON pindou.material.id = pindou.user_material.materialId
    LEFT JOIN pindou.user tmp_u ON pindou.user_material.userId = tmp_u.id
    ORDER BY materialId DESC
    `, []) as MaterialSqlResponse[];;
    const colletions = new Collection<number, MaterialSqlResponse>(sqlRes, item => item.materialId);
    const res: Material[] = [];
    colletions.toArray().forEach((value) => {
      const {materialId, materialDescription, materialTitle, categoryId, categoryName, coverId, coverFileName, coverFilePath, materialBackground} = value[0];
      const m: Material = {
        id: materialId,
        title: materialTitle,
        description: materialDescription,
        files: [],
        users: [],
        category: {
          id: categoryId,
          name: categoryName,
        },
        cover: {
          id: coverId,
          fileName: coverFileName,
          filePath: coverFilePath,
        },
        background: materialBackground,
      };
      m.files = value.map(item => ({
        id: item.fileId,
        filePath: item.filePath,
        fileName: item.fileName,
      }));
      m.users = value.map(item => ({
        id: item.userId,
        name: item.userName,
        email: item.userEmail,
      }));
      res.push(m);
    })
    return res;
  }

  async changeHot(ids: number[]) {
    const allHot = await this.app.mapper.hot.select({
      columns: ['materialId'],
    });
    const allHotIds = allHot.map(h => h.materialId);
    const toDeleteIds = allHotIds.filter(materialId => ids.indexOf(materialId) === -1);
    const toAddIds = ids.filter(id => allHotIds.indexOf(id) === -1);

    return await this.app.mysql.beginTransactionScope(async (conn: any) => {
      conn.delete('hot', {
        materialId: toDeleteIds,
      });
      conn.insert('hot', toAddIds.map(id => ({materialId: id})));
      return { status: 200 };
    }, this.ctx);
  }
}

export default UserService;
