/**
 * @file store of connection
 */
import { ProviderRepo } from '../../utils/ProviderRepo';
import { isString, isFunction } from 'lodash';
import { error } from '../../utils/log';
import { useContext, useMemo } from 'react';

interface Options {
  relateKey: string;
  mapState: { [key: string]: (store: any) => object };
  mapDispatch: { [key: string]: (store: any) => any };
  deps: Array<any>;
}

type Action = { type: string; payload: any };

interface Result {
  state: { [key: string]: any };
  dispatch: (key: string, action: Action) => any;
  Consumer: object;
}

interface Store {
  dispatch: (action: Action) => any;
  getState: (path?: string) => any;
  // subscribe: (fn: Function) => void;
}

function useConnect(options: Options): Result {
  const { relateKey, mapDispatch, mapState, deps = [] } = options;
  if (!isString(relateKey)) {
    error('the relateKey must exist when invoke useConnect.');
  }

  const Context = useMemo(() => {
    return ProviderRepo.getFromRepo(relateKey);
  }, [relateKey]);

  if (!Context) {
    // @ts-ignore
    error(`the key of ${relateKey} has nothing, please make sure the key has Context Component.`);
  }

  const store: Store = useContext(Context);

  const partState = useMemo(() => {
    const globalState = store.getState();
    if (isFunction(mapState)) {
      return mapState(globalState);
    }
    return globalState;
  }, deps);

  const partDispatch = useMemo(() => {
    let dispatchFn = {};
    if (isFunction(mapDispatch)) {
      const { dispatch, getState } = store;
      const globalState = getState();
      dispatchFn = mapDispatch(globalState, dispatch);
    }
    return (key: string, ...rest: Array<any>) => {
      const fn = dispatchFn[key];
      if (isFunction(fn)) {
        return fn(...rest);
      }
    };
  }, deps);

  return {
    state: partState,
    dispatch: partDispatch,
    Consumer: Context.Consumer
  };
}

export default useConnect;
