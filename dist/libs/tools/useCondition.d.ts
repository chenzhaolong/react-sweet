declare type condition1 = boolean;
declare type condition2 = () => boolean;
interface Options {
  yes: object;
  no: object;
  condition: condition1 | condition2;
}
declare function useCondition(options: Options, deps?: Array<any>): any;
export default useCondition;
