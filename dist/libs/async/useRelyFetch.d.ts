interface Options {
  main: (params: any) => Promise<any>;
  rely: (params: any) => Promise<any>;
  initValue?: any;
  paramsFn?: (params: Params1) => any;
  onSuccess?: (response: Params, setResponse: (mainData: any, relyData: any) => any) => void;
  onError?: (error: any, type: string, setResponse: (mainData: any, relyData: any) => any) => void;
  closeLoading?: boolean;
  deps?: Array<any>;
}
interface Params1 {
  mainData: any;
  relyParams: any;
}
interface Params {
  mainData: any;
  relyData: any;
}
interface Params2 {
  mainParams: any;
  relyParams: any;
}
interface Result {
  response: Params;
  start: (params: Params2) => any;
  loading: boolean;
  isError: boolean;
}
declare function useRelyFetch(options: Options): Result;
export default useRelyFetch;
