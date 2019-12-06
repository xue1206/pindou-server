import {Application} from 'egg';

type initialOptions = {
  tableName: string,
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

  insert(params: object): Promise<T> {
    return this.app.mysql.insert(this.tableName, params);
  }

  update(params: object): Promise<T> {
    return this.app.mysql.update(this.tableName, params);
  }

  delete(params: object): Promise<T> {
    return this.app.mysql.delete(this.tableName, params);
  }
}

export default Mapper;