/**
 * @file 日志插件
 */
declare type Action = {
  type: string;
  payload: any;
};
declare type Dispatch = (action: Action) => any;
export declare function logPlugins(globalState: object): (rootDispatch: Dispatch) => (action: Action) => void;
export {};
