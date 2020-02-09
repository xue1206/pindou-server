import {Controller} from 'egg';

// 定义创建接口的请求参数规则
const createRule = {
  title: 'string',
  description: 'string',
  files: 'array',
};

class MaterialsController extends Controller {

  async getByToken() {
    const res = await this.ctx.service.user.getByToken(this.ctx.request.body.token);
    this.ctx.body = {
      user: res,
      status: 200,
    }
  }

  async show() {
    const res = await this.ctx.service.material.getById(this.ctx.params.id);
    this.ctx.body = {
      material: res,
      status: 200,
    };
  }

  async create() {
    this.ctx.validate(createRule, this.ctx.request.body);
    const res = await this.ctx.service.material.create(this.ctx.request.body);
    this.ctx.body = res;
    this.ctx.status = 201;
  }

  async update() {
    const res = await this.ctx.service.material.updateMaterial(this.ctx.params.id, this.ctx.request.body);
    this.ctx.body = res;
  }

  async list() {
    const {pn, ps, ext} = this.ctx.request.body

    const res = await this.ctx.service.material.getList({
      pn: pn == null ? 0 : pn - 1,
      ps: ps == null ? 999 : ps, // TODO 999 infinite
      ext,
    });
    this.ctx.body = {
      list: res,
      status: 200,
    }
  }

  async hot() {
    const res = await this.ctx.service.material.getHotList();
    this.ctx.body = {
      list: res,
      status: 200,
    }
  }

  async changeHot() {
    const {ids} = this.ctx.request.body;
    const res = await this.ctx.service.material.changeHot(ids);
    this.ctx.body = res;
  }

  async destroy() {
    const res = await this.ctx.service.material.delete(this.ctx.params.id);
    this.ctx.body = res;
  }
}

export default MaterialsController;
