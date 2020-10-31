interface Options {
  relateKey: string;
  mapState: {
    [key: string]: (store: any) => object;
  };
  mapDispatch: {
    [key: string]: (store: any) => any;
  };
  deps: Array<any>;
}
declare type Action = {
  type: string;
  payload: any;
};
interface Result {
  state: {
    [key: string]: any;
  };
  dispatch: (key: string, action: Action) => any;
  Consumer: object;
}
declare function useConnect(options: Options): Result;
export default useConnect;
