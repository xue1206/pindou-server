import Mapper from '../../utils/Mapper'
import {User} from '../entity/user'

class UserMapper extends Mapper<User> {
  async getById(id: number | string): Promise<User> {
    return this.get({id});
  }
}

export default UserMapper;