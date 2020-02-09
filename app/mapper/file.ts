import Mapper from '../../utils/Mapper'
import {File} from '../entity/file'

class FileMapper extends Mapper<File> {
  async getById(id: number | string): Promise<File> {
    return this.get({id});
  }
}

export default FileMapper;