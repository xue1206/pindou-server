import {Controller} from 'egg';

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }
}

export default HomeController;
