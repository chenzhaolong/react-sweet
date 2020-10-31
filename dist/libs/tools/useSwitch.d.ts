declare type Value = {
  [key: string]: number | string;
};
declare function useSwitch(style: Value, condition: any, deps?: Array<any>): object;
export default useSwitch;
