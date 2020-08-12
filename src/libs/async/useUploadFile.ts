/**
 * @file upload the file
 */
import { useState, useCallback } from 'react';
import { isFunction, isObject } from 'lodash';
import { hasProperty } from '../../utils/tools';
import { error } from '../../utils/log';

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

function useUploadFile(uploadFn: UploadFn, options: Options): Result {
  checkFn(uploadFn, options);
  const {} = options;
}

export default useUploadFile;
