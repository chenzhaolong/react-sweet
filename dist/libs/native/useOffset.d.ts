interface Offset {
  offsetTop: number;
  offsetLeft: number;
  offsetWidth: number;
  offsetHeight: number;
}
declare type empty = {};
interface Result {
  element: object;
  offset: empty | Offset;
}
declare function useOffset(deps?: Array<any>): Result;
export default useOffset;
