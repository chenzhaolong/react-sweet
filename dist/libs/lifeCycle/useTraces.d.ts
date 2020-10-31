/**
 * @file get the status of life cycle for functional component
 * todo:后续可以根据某些依赖来计算出他的update次数
 */
interface Value1 {
  updateTimes: number;
  dep: string;
  prevUpdateTime: string;
  currentUpdateTime: string;
  prevValue: any;
  currentValue: any;
}
declare type Value2 = Array<Value1>;
interface Options {
  [key: string]: any;
}
declare function useTraces(trace: Options, isHideInProd?: boolean): Value2;
export default useTraces;
