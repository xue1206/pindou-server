// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory from '../../../app/service/category';
import ExportFile from '../../../app/service/file';
import ExportMaterial from '../../../app/service/material';
import ExportUser from '../../../app/service/user';

declare module 'egg' {
  interface IService {
    category: ExportCategory;
    file: ExportFile;
    material: ExportMaterial;
    user: ExportUser;
  }
}
