// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/controller/account';
import ExportCategory from '../../../app/controller/category';
import ExportFile from '../../../app/controller/file';
import ExportHome from '../../../app/controller/home';
import ExportMaterials from '../../../app/controller/materials';
import ExportUsers from '../../../app/controller/users';

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    category: ExportCategory;
    file: ExportFile;
    home: ExportHome;
    materials: ExportMaterials;
    users: ExportUsers;
  }
}
