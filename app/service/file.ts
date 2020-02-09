import {Service} from 'egg';
import {File} from '../entity/file'

class FileService extends Service {
  async select(params: any): Promise<File[]> {
    const { name, email, pageNo = 0, pageSize = 10 } = params;
    const where = this.ctx.helper.filterNotNull({ name, email });
    const res = await this.app.mapper.file.select({
      where, // WHERE 条件
      columns: [ 'name', 'email' ], // 要查询的表字段
      orders: [[ 'id', 'desc' ]], // 排序方式
      limit: pageSize, // 返回数据量
      offset: pageNo * pageSize,
    });
    return res;
  }

  async create(params: File) {
    const res = await this.app.mapper.file.insert(params);
    return res;
  }

  getById(id: string | number) {
    return this.app.mapper.file.getById(id);
  }
}

export default FileService;
