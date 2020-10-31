declare type Action = {
  type: string;
  payload: any;
};
declare type Dispatch = (action: Action) => any;
export declare function cachePlugins(globalState: object): (next: Dispatch) => (action: Action) => void;
export {};
