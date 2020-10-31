interface Result {
  response: any;
  startFetch: (params?: any) => any;
  loading: boolean;
  isError: boolean;
}
interface Options {
  initValue?: any;
  path?: string;
  onError?: (error: any, setResponse: (data: any) => any) => void;
  onSuccess?: (data: any, setResponse: (data: any) => any) => void;
  closeLoading?: boolean;
  deps?: Array<any>;
}
declare type Fetch = (params: any) => Promise<any>;
declare function useFetch(fetch: Fetch, options?: Options): Result;
export default useFetch;
