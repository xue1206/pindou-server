import 'egg';
import ExportUser from '../app/mapper/user'
import ExportMaterial from '../app/mapper/material'
import ExportFile from '../app/mapper/file';
import ExportCategory from '../app/mapper/category';
import ExportHot from '../app/mapper/hot';

declare module 'egg' {
  interface Application {
    mysql: any;
    mapper: {
      user: ExportUser,
      material: ExportMaterial,
      file: ExportFile,
      category: ExportCategory,
      hot: ExportHot,
    };
  }
}