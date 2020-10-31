interface ReturnValue {
  data: any;
  changeData: (path: string, value: any) => void;
}
/**
 * 浅比较
 * @param obj1 {any} 对象
 * @param obj2 {any} 对象
 * @return {boolean} 返回值
 */
export declare function shadowEqual(obj1: object, obj2: object): boolean;
declare function useData(value: any): ReturnValue;
export default useData;
