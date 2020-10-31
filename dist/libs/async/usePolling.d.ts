interface Polling {
  response: any;
  loading: boolean;
  start: (params: any) => any;
  reset: (initData?: any) => void;
  isError: boolean;
}
interface Options {
  intervalTime: number;
  terminate: (data: any) => boolean;
  initValue?: any;
  onError?: (error: any, setResponse: (data: any) => any) => any;
  onSuccess?: (data: any, setResponse: (data: any) => any) => void;
  onCompleteByLimitNumber?: (setResponse: (data: any) => any) => void;
  onCompleteByLimitTime?: (setResponse: (data: any) => any) => void;
  onReset?: (setResponse: (data: any) => any) => void;
  limitPollingNumber?: number;
  limitPollingTime?: number;
  closeLoading?: boolean;
  deps?: Array<any>;
}
declare type Func = (params?: any) => any;
declare function usePolling(callback: Func, options: Options): Polling;
export default usePolling;
