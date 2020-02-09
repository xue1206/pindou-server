import {Controller} from 'egg';
import { createWriteStream } from 'fs';
import { createHash } from 'crypto';
import { ensureDir } from 'fs-extra';
// // 定义创建接口的请求参数规则
// const createRule = {
//   email: 'string',
//   name: 'string',
//   pwd: 'string',
// };

const suffixRegExp = /.+(\.\w+)$/

function currentDateFilePath() {
  const _d = new Date();
  return `${_d.getFullYear()}/${_d.getMonth() + 1}/${_d.getDate()}`;
}

class FileController extends Controller {

  async upload() {
    // this.ctx.validate(createRule, this.ctx.request.body);
    // const res = await this.ctx.service.user.create(this.ctx.request.body);
    const fileStream = await this.ctx.getFileStream();
    console.log('---fileStream:', fileStream);
    const fileName = fileStream.filename;
    const suffixCaptureGroup = fileName.match(suffixRegExp)
    const suffix = suffixCaptureGroup ? suffixCaptureGroup[1] : '';
    const hash = createHash('sha256');
    hash.update(fileName);
    const fileNameHash = hash.digest('hex');
    const serverFileName = fileNameHash + suffix;
    const prefix = 'app';
    const dirPath = `/public/${currentDateFilePath()}`;
    await ensureDir(prefix + dirPath)
    const filePath = dirPath + '/' + serverFileName;
    fileStream.pipe(createWriteStream(prefix + filePath));
    const res = await this.ctx.service.file.create({
      fileName,
      filePath,
    })
    this.ctx.body = {
      status: 200,
      file: {
        id: res.insertId,
        fileName,
        filePath,
      },
    };
    this.ctx.status = 201;
  }
}

export default FileController;
