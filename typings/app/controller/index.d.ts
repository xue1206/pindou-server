// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportAccount from '../../../app/controller/account';
import ExportHome from '../../../app/controller/home';
import ExportUsers from '../../../app/controller/users';

declare module 'egg' {
  interface IController {
    account: ExportAccount;
    home: ExportHome;
    users: ExportUsers;
  }
}
