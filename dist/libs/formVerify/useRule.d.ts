interface Result {
  value: any;
  isPass: any;
  verify: (newValue: any, options?: Options) => void;
}
interface Options {
  success?: () => any;
  fail?: () => any;
}
declare function useRule(rule: any, initValue: any, isCleanWhenError?: boolean, deps?: Array<any>): Result;
export default useRule;
