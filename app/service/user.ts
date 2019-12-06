import {Service} from 'egg';
import {sign} from 'jsonwebtoken';
import {User} from '../entity/user'
import {verify} from 'jsonwebtoken';

type DecodeInfo = {
  id: number,
  exp: number,
}

interface PageInfo<T = null> {
  pn: number|string,
  ps: number|string,
  ext: T
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

  async create(params: User): Promise<User> {
    const res = await this.app.mapper.user.insert(params);
    return res;
  }

  async login(params: object) {
    const user = await this.app.mapper.user.get(params);
    let res: object;
    if (user) {
      const token = sign(
        {
          name: user.name,
          email: user.email,
          id: user.id,
        },
        this.config.checkToken.secret,
        { expiresIn: 60 * 60 }
      );
      res = {
        status: '0',
        token,
      };
    } else {
      res = {
        status: '1001',
        msg: '用户名或密码错误',
      };
    }
    return res;
  }

  getById(id: string | number) {
    return this.app.mapper.user.getById(id);
  }

  async getByToken(token: string) {
    const decode = verify(token, this.config.checkToken.secret) as DecodeInfo;
    const res = await this.getById(decode.id);
    return res;
  }

  async getList(pageInfo: PageInfo<{name: string, email: string}>) {
    const {pn, ps, ext} = pageInfo
    const res = await this.select({
      pageNo: pn,
      pageSize: ps,
      name: ext && ext.name,
      email: ext && ext.email,
    })
    return res
  }
}

export default UserService;
