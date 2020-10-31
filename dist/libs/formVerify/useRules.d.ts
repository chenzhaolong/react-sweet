interface Options {
  [key: string]: any;
}
interface Result {
  result: boolean;
  values: {
    [key: string]: any;
  };
  verify: (newValue: any, options?: Options) => void;
  logs: {
    [key: string]: boolean;
  };
}
declare function useRules(options: Options, deps?: Array<any>): Result;
export default useRules;
