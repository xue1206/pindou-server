import Mapper from '../../utils/Mapper'
import {Material} from '../entity/material'

class MaterialMapper extends Mapper<Material> {
  async getById(id: number | string): Promise<Material> {
    return this.get({id});
  }
}

export default MaterialMapper;