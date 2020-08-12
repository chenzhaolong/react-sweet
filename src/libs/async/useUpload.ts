/**
 * @file upload the file
 */
import {} from 'react';
import {} from 'lodash';

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
  onStop?: (setResponse: (data: any) => void) => void;
  onReset?: (setResponse: (data: any) => void) => void;
}

interface Result {
  response: { status: Status; data: any; percentage: number };
  start: (params: any) => void;
  reset: () => void;
  stop: () => void;
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

function useUpload(options: Options, deps: Array<any>): Result {
  const {} = options;
  console.log('useUpload');
}

export default useUpload;
