declare type FetchList = () => Promise<any>;
declare enum AutoFetchTimeType {
  MOUNT = 'mount',
  UPDATE = 'update'
}
interface Options {
  initValue?: any;
  onError?: (e: Error, setData: (data: any) => void) => void;
  onSuccess?: (data: object, setData: (data: any) => void) => void;
  closeLoading?: boolean;
  updateDeps?: Array<any>;
  autoFetchMoment?: AutoFetchTimeType;
}
interface Result {
  readonly response?: object;
  loading?: boolean;
  isError: boolean;
}
declare function useAutoFetch(fetchList: FetchList, options: Options): Result;
export default useAutoFetch;
