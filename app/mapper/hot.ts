import Mapper from '../../utils/Mapper'
import {Hot} from '../entity/hot'

class HotMapper extends Mapper<Hot> {
  async getById(id: number | string): Promise<Hot> {
    return this.get({id});
  }
}

export default HotMapper;