interface Options {
  openChunk?: boolean;
  limitChunkNumber?: number;
  limitFileSize?: number;
  chunkSize: number;
  interval?: number;
  onSuccess?: (response: any, setResponse: (data: any) => void) => void;
  onError?: (error: any, setResponse: (data: any) => void) => void;
  onTerminate?: (setResponse: (data: any) => void) => void;
  onPause?: (setResponse: (data: any) => void) => void;
  onProgress?: (data: any) => void;
  deps?: Array<any>;
  useMd5?: boolean;
  initValue?: any;
  timeout: number;
  onTimeout: (data: any, setResponse: (data: any) => void) => void;
}
interface Result {
  response: {
    status: Status;
    data: any;
    percentage: number;
  };
  start: (params: any) => void;
  terminate: () => void;
  pause: () => void;
  resume: () => void;
  loading: boolean;
}
declare enum Status {
  START = 'start',
  UPLOADING = 'uploading',
  SUCCESS = 'success',
  FAIL = 'fail',
  PAUSE = 'pause',
  TERMINATE = 'terminate',
  UNSTART = 'unstart',
  TIMEOUT = 'timeout'
}
declare type UploadFn = (chunk: number, content: Blob, md5Value: string, file: File, total?: number) => Promise<any>;
declare function useUploadFile(uploadFn: UploadFn, options: Options): Result;
export default useUploadFile;
