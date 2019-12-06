import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.keys = appInfo.name + '_pd-server-egg_cookie';

  // add your middleware config here
  config.middleware = [ 'checkToken' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
    ...userConfig,
    checkToken: {
      secret: 'jwt-secret-xueyong',
    },
    security: {
      csrf: {
        // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
        enable: false,
      },
    },
    mysql: {
      // 单数据库信息配置
      client: {
        // host
        host: 'localhost',
        // 端口号
        port: '3306',
        // 用户名
        user: 'xueyong',
        // 密码
        password: '',
        // 数据库名
        database: 'pindou',
      },
      // 是否加载到 app 上，默认开启
      app: true,
      // 是否加载到 agent 上，默认关闭
      agent: false,
    },
  };
};
