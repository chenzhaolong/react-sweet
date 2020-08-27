/**
 * @file store of state
 */

interface Options {
  openAsync?: boolean;
  plugins?: Array<Function>;
  initState?: object;
}

type Reducer = { [key: string]: object };

type Action = { type: string; payload: any };

interface Result {
  dispatch: (action: Action) => any;
  getState: () => object;
  subscribe: (fn: Function) => void;
}

function useStore(reducer: Reducer, options: Options): Result {
  const {} = options;
  console.log(reducer);
  return {
    dispatch(action: Action) {
      console.log(action);
    },
    getState() {
      return {};
    },
    subscribe(fn: Function) {
      console.log(fn);
    }
  };
}

export default useStore;
