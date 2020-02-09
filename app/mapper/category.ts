import Mapper from '../../utils/Mapper'
import {Category} from '../entity/category'

class CategoryMapper extends Mapper<Category> {
  async getById(id: number | string): Promise<Category> {
    return this.get({id});
  }
}

export default CategoryMapper;