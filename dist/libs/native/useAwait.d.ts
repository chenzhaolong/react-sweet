declare enum Status {
  Success = 'success',
  Fail = 'fail',
  Wait = 'wait'
}
interface Result {
  status: Status;
  data: any;
  error: any;
}
declare function useAwait(callback: any, deps?: Array<any>): Result;
export default useAwait;
