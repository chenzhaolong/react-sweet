/**
 * @file store of state
 */
import { useReducer, useMemo } from 'react';
import { isFunction, isObject, get, isString } from 'lodash';
import { error } from '../../utils/log';
import { StoreUtils } from '../../utils/store';
import { logPlugins } from '../../plugins/logPlugins';

interface Options {
  openAsync?: boolean;
  plugins?: Array<Function>;
  initState?: object;
  // deps?: Array<any>;
}

type Reducer = (state: any, action: any) => object;

type Obj = { [key: string]: Reducer };

type Action = { type: string; payload: any };

interface Result {
  dispatch: (action: Action) => any;
  getState: (path?: string) => any;
  // subscribe: (fn: Function) => void;
}

function useStore(reducer: Reducer | Obj, options: Options): Result {
  if (!isFunction(reducer) || !isObject(reducer)) {
    error('the reducer must be pure function or object in useStore');
  }
  const { openAsync = false, plugins = [], initState = {} } = options;

  const combineReducer = useMemo(() => {
    return isObject(reducer) ? StoreUtils.combineReducer(reducer) : reducer;
  }, [reducer]);

  const [state, rootDispatch] = useReducer(combineReducer, initState);

  const middleWares = useMemo(() => {
    const middleWares = StoreUtils.applyMiddleWares(plugins);
    middleWares.push(logPlugins);
    return middleWares.map((fn: Function) => fn(state));
  }, plugins);

  const wrapperDispatch = useMemo(() => {
    return StoreUtils.compose(middleWares)(rootDispatch);
  }, plugins);

  return {
    dispatch(action: Action) {
      // @ts-ignore
      if (openAsync && isObject(action) && isFunction(action.payload)) {
        const { payload, type } = action;
        const realDispatch = (data: any) => {
          wrapperDispatch({ type, payload: data });
        };
        return payload(state, realDispatch);
      } else {
        wrapperDispatch(action);
      }
    },
    getState(path?: string) {
      if (isString(path)) {
        return get(state, path, {});
      } else {
        return state;
      }
    }
    // subscribe(fn: Function) {
    //   console.log(fn);
    // }
  };
}

export default useStore;
