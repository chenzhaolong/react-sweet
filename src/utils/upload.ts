/**
 * @file the utils of upload
 */
import { Md5 } from 'ts-md5';
import { isNumber } from 'lodash';

export class Upload {
  static getMd5(file: File, useMd5: boolean) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      if (useMd5) {
        fileReader.readAsBinaryString(file);
        fileReader.onload = () => {
          const md5 = new Md5();
          // @ts-ignore
          md5.appendStr(this.result);
          const result = md5.end();
          resolve(result);
        };
        fileReader.onerror = (e: any) => {
          reject(e);
        };
      } else {
        resolve('');
      }
    });
  }

  static checkFileOverSize(fileSize: number, limitFileSize?: number) {
    if (isNumber(limitFileSize) && isNumber(fileSize)) {
      return fileSize > limitFileSize;
    }
    return false;
  }

  static getChunkNumber(file: File, chunkSize: number) {
    return Math.ceil(file.size / chunkSize);
  }

  static checkChunkOverNumber(chunkNumber: number, limitChunkNumber?: number) {
    if (isNumber(chunkNumber) && isNumber(limitChunkNumber)) {
      return chunkNumber > limitChunkNumber;
    }
    return false;
  }

  static computeChunkContent(file: File, baseSize: number, chunk: number) {
    const start = chunk * baseSize;
    let end = start + baseSize;
    if (end > file.size) {
      end = file.size;
    }
    return file.slice(start, end);
  }

  static getUploadParams(file: File, chunkNumber: number, chunkSize: number, md5Value: any) {
    const paramsList = [];
    for (let i = 0; i < chunkNumber; i++) {
      paramsList.push({
        chunk: i,
        content: Upload.computeChunkContent(file, chunkSize, i),
        md5: md5Value
      });
    }
    return paramsList;
  }
}
