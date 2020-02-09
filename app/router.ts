import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.resources('users', '/api/users', controller.users);
  router.post('/api/account/login', controller.account.login);
  router.post('/api/account/register', controller.account.register);
  router.post('/api/account/getAllUsers', controller.account.getAllUsers);
  router.post('/api/users/getUserInfoByToken', controller.users.getByToken);
  router.post('/api/users/list', controller.users.list);
  router.resources('materials', '/api/materials', controller.materials);
  router.post('/api/materials/list', controller.materials.list);
  router.post('/api/materials/hot', controller.materials.hot);
  router.post('/api/materials/changeHot', controller.materials.changeHot);
  router.post('/api/upload', controller.file.upload);
  router.post('/api/category/list', controller.category.list);
  router.get('/', controller.home.index);
};
