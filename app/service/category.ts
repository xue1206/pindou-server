import {Service} from 'egg';
import {User} from '../entity/user'
import {verify} from 'jsonwebtoken';
import { Material } from '../entity/material';

type DecodeInfo = {
  id: number,
  exp: number,
}

interface PageInfo<T = null> {
  pn: number,
  ps: number,
  ext: T
}

class CategorySevierce extends Service {
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
      const {title, description, files, users} = params;
      const insertedMaterialRes = await conn.insert('material', {
        title,
        description,
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

  getById(id: string | number) {
    return this.app.mapper.user.getById(id);
  }

  async getByToken(token: string) {
    const decode = verify(token, this.config.checkToken.secret) as DecodeInfo;
    const res = await this.getById(decode.id);
    return res;
  }

  async getList(pageInfo: PageInfo<{title: string, description: string}>) {
    const res = await this.app.mapper.category.select({
      columns: [ 'id', 'name', 'description' ], // 要查询的表字段
      orders: [[ 'id', 'desc' ]], // 排序方式
      ...pageInfo ? {
        limit: pageInfo.ps, // 返回数据量
        offset: pageInfo.pn * pageInfo.ps,
      } : {}
    });
    return res;
  }
}

export default CategorySevierce;
