/**
 * @file the utils of upload
 */
import { Md5 } from 'ts-md5';
import { isNumber, isFunction, isObject } from 'lodash';
import { error, warning } from './log';
import { hasProperty } from './tools';

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

  static checkFile(file: any) {
    if (!file) {
      warning('file is undefined when get start in the useUploadFile.');
      return false;
    }
    if (!(file instanceof File)) {
      warning('file is not the instance of File.');
      return false;
    }
    if (!file.size) {
      warning('file has no size when get start in the useUpLoadFile.');
      return false;
    }
    return true;
  }

  static checkFn(uploadFn: any, options: any) {
    if (!isFunction(uploadFn)) {
      error('the first params must be function in useUploadFile.');
    }
    if (!isObject(options)) {
      error('the second params must be object in useUploadFile.');
    } else {
      if (!hasProperty(options, 'chunkSize', 'number')) {
        error('the chunkSize of options must exist and must be number in useUploadFile.');
      }
    }
  }
}
