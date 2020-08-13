/**
 * @file upload the file
 */
import { useState, useCallback } from 'react';
import { isFunction, isObject, isNumber } from 'lodash';
import { hasProperty, isPromise } from '../../utils/tools';
import { error } from '../../utils/log';
import { Md5 } from 'ts-md5/dist/md5';

interface Options {
  openChunk?: boolean;
  limitChunkNumber?: number;
  limitFileSize?: number;
  chunkSize: number;
  timeout?: number;
  openPercentage?: boolean;
  threads?: number;
  onSuccess?: (response: any, setResponse: (data: any) => void) => void;
  onError?: (error: any, setResponse: (data: any) => void) => void;
  onPause?: (setResponse: (data: any) => void) => void;
  onTerminate?: (setResponse: (data: any) => void) => void;
  onProgress?: (setResponse: (data: any) => void) => void;
  deps?: Array<any>;
  useMd5?: boolean;
  initValue?: any;
}

interface Result {
  response: { status: Status; data: any; percentage: number };
  start: (params: any) => void;
  terminate: () => void;
  pause: () => void;
  resume: () => void;
  loading: boolean;
}

enum Status {
  START = 'start',
  UPLOADING = 'upload',
  SUCCESS = 'success',
  FAIL = 'fail',
  PAUSE = 'pause',
  STOP = 'stop'
}

type UploadFn = (chunk: number, content: string, md5Value: string, file: File) => Promise<any>;

function checkFn(uploadFn: any, options: any) {
  if (!isFunction(uploadFn)) {
    error('the first params must be function in useUpload.');
  }
  if (!isObject(options)) {
    error('the second params must be object in useUpload.');
  } else {
    if (!hasProperty(options, 'chunkSize', 'number')) {
      error('the chunkSize of options must exist and must be number in useUpload.');
    }
  }
}

function checkFile(file: any): void {
  if (!file) {
    error('file is undefined when get start in the useUploadFile.');
  }
  if (!(file instanceof File)) {
    error('file is not the instance of File.');
  }
}

function checkPromise(promise: any): void {
  if (!isPromise(promise)) {
    error('the first input params must be promise.');
  }
}

function useUploadFile(uploadFn: UploadFn, options: Options): Result {
  checkFn(uploadFn, options);
  const {
    openChunk = true,
    limitChunkNumber,
    limitFileSize,
    chunkSize,
    timeout,
    openPercentage = false,
    threads,
    onSuccess,
    onError,
    onPause,
    onTerminate,
    onProgress,
    deps,
    useMd5 = false,
    initValue
  } = options;

  const [response, setResponse] = useState(initValue || {});
  const [loading, setLoading] = useState(false);
  const realDeps = deps || [];

  const getMd5 = useCallback((file) => {
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
  }, []);

  const checkFileSize = useCallback((fileSize: number) => {
    if (isNumber(limitFileSize) && isNumber(fileSize)) {
      return fileSize > limitFileSize;
    }
    return true;
  }, []);

  const handleSuccess = useCallback((data: any) => {
    setLoading(false);
    if (isFunction(onSuccess)) {
      onSuccess(data, setResponse);
    } else {
      setResponse(data);
    }
  }, []);

  const handleError = useCallback((error: any) => {
    setLoading(false);
    if (isFunction(onError)) {
      onError(error, setResponse);
    } else {
      throw error;
    }
  }, []);

  const start = useCallback((file: any) => {
    checkFile(file);
    setLoading(true);

    if (openChunk) {
    } else {
      if (checkFileSize(file.size)) {
        console.warn('the fileSize is over the limitFileSize');
        return;
      }
      const content = file.silce(0, file.size - 1);
      getMd5(content)
        .then((md5Value: any) => {
          const promise = uploadFn(1, content, md5Value, file);
          checkPromise(promise);
          promise
            .then((data: any) => {
              handleSuccess(data);
            })
            .catch((e: any) => {
              handleError(e);
            });
        })
        .catch((e) => {
          handleError(e);
        });
    }
  }, realDeps);

  const terminate = useCallback(() => {}, realDeps);

  const pause = useCallback(() => {}, realDeps);

  const resume = useCallback(() => {}, realDeps);

  return { response, loading, start, pause, resume, terminate };
}

export default useUploadFile;
