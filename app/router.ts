import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.resources('users', '/api/users', controller.users);
  router.post('/api/account/login', controller.account.login);
  router.post('/api/account/register', controller.account.register);
  router.post('/api/account/getAllUsers', controller.account.getAllUsers);
  router.post('/api/users/getUserInfoByToken', controller.users.getByToken);
  router.post('/api/users/list', controller.users.list);
  router.get('/', controller.home.index);
};
