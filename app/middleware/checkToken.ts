import {verify} from 'jsonwebtoken';

const path_ignore = [
  '/api/account/register',
  '/api/account/login',
  '/api/materials/list',
  '/api/materials/hot',
]

type DecodeInfo = {
  name?: string,
  exp: number,
}

export default options => {
  return async function(ctx, next) {
    // 拿到传会数据的header 中的token值
    const token = ctx.request.header.authorization;
    const method = ctx.method.toLowerCase();
    // 当前请求时get请求，执行接下来的中间件
    if (method === 'get' || path_ignore.includes(ctx.path)) {
      await next();
    // 当前token值不存在的时候
    } else {
      if (!token) {
        ctx.status = 200;
        ctx.body = {
          status: -1,
          msg: '未登录， 请先登录',
        };
        return;
      }
      try {
        const decode = verify(token, options.secret) as DecodeInfo;
        if (!decode || !decode.name) {
          ctx.status = 200;
          ctx.body = {
            status: -2,
            msg: '没有权限，请登录',
          };
        } else if (Date.now() - (decode.exp * 1000) > 0) {
          ctx.status = 200;
          ctx.body = {
            status: -3,
            msg: 'Token已过期',
          };
        } else {
          await next();
        }
      } catch (err) {
        console.log(err)
        if (err.name === 'TokenExpiredError') {
          ctx.status = 200;
          ctx.body = {
            status: -3,
            msg: 'Token已过期',
          };
        } else {
          ctx.status = 200;
          ctx.body = {
            status: 500,
            msg: 'inner error',
          };
        }
      }
    }
  };
};
