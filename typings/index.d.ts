import 'egg';
import ExportUser from '../app/mapper/user'

declare module 'egg' {
  interface Application {
    mysql: any;
    mapper: {
      user: ExportUser;
    };
  }
}