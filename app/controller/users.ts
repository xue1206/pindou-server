import {Controller} from 'egg';

// 定义创建接口的请求参数规则
const createRule = {
  email: 'string',
  name: 'string',
  pwd: 'string',
};

class UsersController extends Controller {

  async getByToken() {
    const res = await this.ctx.service.user.getByToken(this.ctx.request.body.token);
    this.ctx.body = {
      user: res,
      status: 200,
    }
  }

  async show() {
    const res = await this.ctx.service.user.getById(this.ctx.params.id);
    this.ctx.body = {
      user: res,
      status: 200,
    };
  }

  async create() {
    this.ctx.validate(createRule, this.ctx.request.body);
    const res = await this.ctx.service.user.create(this.ctx.request.body);
    this.ctx.body = res;
    this.ctx.status = 201;
  }

  async list() {
    const {pn, ps, ext} = this.ctx.request.body
    const res = await this.ctx.service.user.getList({
      pn: pn - 1,
      ps,
      ext,
    })
    this.ctx.body = {
      list: res,
      status: 200,
    }
  }
}

export default UsersController;
