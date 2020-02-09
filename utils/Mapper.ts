import {Application} from 'egg';

type initialOptions = {
  tableName: string,
}

interface InsertResult{
  fieldCount: number,
  affectedRows: number,
  insertId: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number
}

class Mapper<T> {
  tableName: string;
  app: Application;

  constructor(app: Application, options: initialOptions) {
    this.tableName = options.tableName;
    this.app = app;
  }

  get(params: object): Promise<T> {
    return this.app.mysql.get(this.tableName, params) as Promise<T>;
  }

  select(params: object): Promise<T[]> {
    return this.app.mysql.select(this.tableName, params) as Promise<T[]>;
  }

  async insert(params: object): Promise<InsertResult> {
    const res = await this.app.mysql.insert(this.tableName, params);
    if (res.affectedRows === 0) {
      const e = new Error('affectRows 0');
      throw e;
    }
    return res;
  }

  update(params: object): Promise<T> {
    return this.app.mysql.update(this.tableName, params);
  }

  delete(params: object): Promise<T> {
    return this.app.mysql.delete(this.tableName, params);
  }

  query(sql: string, params: (string|number)[]): Promise<any> {
    return this.app.mysql.query(sql, params);
  }
}

export default Mapper;