interface Options {
  openAsync?: boolean;
  plugins?: Array<Function>;
  initState?: object;
  openCache?: boolean;
  openLog?: boolean;
}
declare type Reducer = (state: any, action: any) => object;
declare type Obj = {
  [key: string]: Reducer;
};
declare type Action = {
  type: string;
  payload: any;
};
interface Result {
  dispatch: (action: Action) => any;
  getState: (path?: string, defaultValue?: any) => any;
}
declare function useStore(reducer: Reducer | Obj, options?: Options): Result;
export default useStore;
