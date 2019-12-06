import {Controller} from 'egg';

// 定义创建接口的请求参数规则
const createRule = {
  email: 'string',
  name: 'string',
  pwd: 'string',
};

type LoginParams = {
  pwd: string,
  name?: string,
  email?: string,
}

class AccountController extends Controller {

  async login() {
    const params:LoginParams = {
      pwd: this.ctx.request.body.pwd,
    };
    if (this.ctx.request.body.email) {
      params.email = this.ctx.request.body.email;
    }
    if (this.ctx.request.body.name) {
      params.name = this.ctx.request.body.name;
    }
    const res = await this.ctx.service.user.login(params);
    this.ctx.body = {
      ...res,
      status: 200,
    };
    this.ctx.status = 200;
  }

  async register() {
    this.ctx.validate(createRule, this.ctx.request.body);
    const res = await this.ctx.service.user.create(this.ctx.request.body);
    this.ctx.body = res;
    this.ctx.status = 201;
  }

  async getAllUsers() {
    const res = await this.ctx.service.user.select(this.ctx.request.body);
    this.ctx.body = res;
    this.ctx.status = 200;
  }

}

export default AccountController;
