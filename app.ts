import * as path from 'path';

export default (app) => {
  const baseName = 'mapper';  //文件夹名
  const baseTestDir = 'app/mapper';//模块目录  这里 放到 app 文件下 
  app.loader.loadToApp(        //将test模块 挂载到 app 上
      path.join(app.baseDir, baseTestDir ),    // path.join()的作用 :将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径。若任意一个路径片段类型错误，会报错。
      baseName,
      {
          caseStyle: 'lower',//小写    this.app.模块名.小写方法名   调用
          ignore: 'test.js',//忽略 test.js 文件   这里配置 你需要忽略的文件  被忽略的文件 将不能通过 this.app.模块名.方法  访问
          initializer: (mapper, opt) => {  //初始化器
              return new mapper(app, {
                tableName: opt.pathName.replace(/(mapper\.)/, '')
              });
          }
      },
  );
}