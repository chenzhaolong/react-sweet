interface Fn {
  value: any;
  trigger: () => any;
}
declare function useMethod(initValue: any, fn: (val: any, args: Array<any>) => any, deps?: Array<any>): Fn;
export default useMethod;
