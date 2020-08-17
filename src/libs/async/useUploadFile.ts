/**
 * @file upload the file
 */
import { useState, useCallback, useRef } from 'react';
import { isFunction, isObject } from 'lodash';
import { hasProperty, isPromise } from '../../utils/tools';
import { error } from '../../utils/log';
import { Upload } from '../../utils/upload';

interface Options {
  openChunk?: boolean;
  limitChunkNumber?: number;
  limitFileSize?: number;
  chunkSize: number;
  timeout?: number;
  // threads?: number;
  onSuccess?: (response: any, setResponse: (data: any) => void) => void;
  onError?: (error: any, setResponse: (data: any) => void) => void;
  onTerminate?: (setResponse: (data: any) => void) => void;
  onPause?: () => void;
  onProgress?: () => void;
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
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAIL = 'fail',
  PAUSE = 'pause',
  TERMINATE = 'terminate',
  UNSTART = 'unstart'
}

interface UploadParams {
  chunk: number;
  content: Blob;
  md5: string;
}

interface Store {
  paramsList: ArrayUploadParams;
  time: number;
  isPause: boolean;
  file: any;
}

type ArrayUploadParams = Array<UploadParams>;

type UploadFn = (chunk: number, content: Blob, md5Value: string, file: File) => Promise<any>;

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

const defaultValue = { paramsList: [], time: 0, isPause: false, file: {} };

function useUploadFile(uploadFn: UploadFn, options: Options): Result {
  checkFn(uploadFn, options);
  const {
    openChunk = true,
    limitChunkNumber,
    limitFileSize,
    chunkSize,
    timeout,
    // threads,
    onSuccess,
    onError,
    onPause,
    onTerminate,
    onProgress,
    deps,
    useMd5 = false,
    initValue
  } = options;

  const [response, setResponse] = useState({ status: Status.UNSTART, data: initValue || {}, percentage: 0 });
  const [loading, setLoading] = useState(false);
  const realDeps = deps || [];
  const store: { current: Store } = useRef(defaultValue);

  const handleSuccess = useCallback((data: any) => {
    const setData = (result: any) => {
      setResponse({
        status: Status.SUCCESS,
        data: result,
        percentage: 100
      });
    };
    setLoading(false);
    store.current = defaultValue;
    if (isFunction(onSuccess)) {
      onSuccess(data, setData);
    } else {
      setData(data);
    }
  }, []);

  const handleError = useCallback((error: any, isWarn?: boolean) => {
    const setData = (error: any) => {
      setResponse({
        status: Status.FAIL,
        data: error,
        percentage: 0
      });
    };
    setLoading(false);
    store.current = defaultValue;
    if (isWarn) {
      return setData(error);
    }
    if (isFunction(onError)) {
      onError(error, setData);
    } else {
      throw error;
    }
  }, []);

  const upload = useCallback(() => {
    const file = store.current.file;
    const { paramsList, time, isPause } = store.current;
    if (paramsList.length === 0 || isPause) {
      return;
    }
    const params = paramsList[time];
    const promise = uploadFn(params.chunk, params.content, params.md5, file);
    checkPromise(promise);
    promise
      .then((data: any) => {
        if (time === paramsList.length - 1) {
          handleSuccess(data);
        } else {
          store.current.time = time + 1;
          setResponse({
            status: Status.UPLOADING,
            data,
            percentage: Math.ceil(store.current.time / paramsList.length)
          });
          isFunction(onProgress) && onProgress();
          setTimeout(() => {
            upload();
          }, timeout || 0);
        }
      })
      .catch((e: any) => {
        handleError(e);
      });
  }, []);

  const start = useCallback((file: any) => {
    checkFile(file);
    if (Upload.checkFileOverSize(file.size, limitFileSize)) {
      console.warn('upload stop, because the fileSize is over the limitFileSize');
      return;
    }
    const chunkNumber = Upload.getChunkNumber(file, chunkSize);

    setLoading(true);
    // 每次开始上传都要重置上次的残留数据
    setResponse({ status: Status.START, data: initValue || {}, percentage: 0 });

    Upload.getMd5(file, useMd5)
      .then((md5Value: any) => {
        if (openChunk && chunkNumber > 1) {
          if (Upload.checkChunkOverNumber(chunkNumber, limitChunkNumber)) {
            console.warn('upload stop, because the chunkNumber is over the limitChunkNumber');
            return handleError(initValue || {}, true);
          }
          store.current = {
            paramsList: Upload.getUploadParams(file, chunkNumber, chunkSize, md5Value),
            time: 0,
            file: file,
            ...store.current
          };
          upload();
        } else {
          const promise = uploadFn(1, file, md5Value, file);
          checkPromise(promise);
          promise
            .then((data: any) => {
              handleSuccess(data);
            })
            .catch((e: any) => {
              handleError(e);
            });
        }
      })
      .catch((e) => {
        handleError(e);
      });
  }, realDeps);

  const terminate = useCallback(() => {
    const setData = (data: any) => {
      setResponse({
        status: Status.TERMINATE,
        data: data,
        percentage: 0
      });
    };
    setLoading(false);
    store.current = defaultValue;
    if (isFunction(onTerminate)) {
      onTerminate(setData);
    } else {
      setData(initValue || {});
    }
  }, realDeps);

  const pause = useCallback(() => {
    store.current.isPause = true;
    setLoading(false);
    setResponse({ ...response, status: Status.PAUSE });
    if (isFunction(onPause)) {
      onPause();
    }
  }, realDeps);

  const resume = useCallback(() => {
    setLoading(true);
    store.current.isPause = false;
    upload();
  }, realDeps);

  return { response, loading, start, pause, resume, terminate };
}

export default useUploadFile;
