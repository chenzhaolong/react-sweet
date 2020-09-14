/**
 * @file store of state
 */
import { useReducer, useMemo, useCallback } from 'react';
import { isFunction, isObject, get, isString } from 'lodash';
import { error } from '../../utils/log';
import { StoreUtils } from '../../utils/store';
import { logPlugins } from '../../plugins/logPlugins';
import { cachePlugins } from '../../plugins/cachePlugins';

interface Options {
  openAsync?: boolean;
  plugins?: Array<Function>;
  initState?: object;
  openCache?: boolean;
  // deps?: Array<any>;
}

type Reducer = (state: any, action: any) => object;

type Obj = { [key: string]: Reducer };

type Action = { type: string; payload: any };

interface Result {
  dispatch: (action: Action) => any;
  getState: (path?: string, defaultValue?: any) => any;
  // subscribe: (fn: Function) => void;
}

function useStore(reducer: Reducer | Obj, options: Options = {}): Result {
  if (!isFunction(reducer) && !isObject(reducer)) {
    error('the reducer must be pure function or object in useStore');
  }
  const { openAsync = false, plugins = [], initState = {}, openCache = false } = options;

  // 合并reducer
  const combineReducer = useMemo(() => {
    return isObject(reducer) ? StoreUtils.combineReducer(reducer) : reducer;
  }, [reducer]);

  // 初始值
  const realInitState = useMemo(() => {
    if (isObject(reducer)) {
      Object.keys(reducer).forEach((key: string) => {
        initState[key] = initState[key] ? initState[key] : {};
      });
    }
    return initState;
  }, []);

  const [state, rootDispatch] = useReducer(combineReducer, realInitState);

  // 中间件
  // const middleWaresFn: Array<Function> = useMemo(() => {
  //   const middleWares = StoreUtils.applyMiddleWares(plugins);
  //   middleWares.push(logPlugins);
  //   return middleWares;
  // }, plugins);
  // const middleWares = middleWaresFn.map((fn: Function) => fn(state));
  // const wrapperDispatch = StoreUtils.compose(middleWares)(rootDispatch);

  // 包装dispatch
  const wrapperDispatch = useCallback(
    (state) => {
      const middleWaresFn = StoreUtils.applyMiddleWares(plugins);
      if (openCache) {
        middleWaresFn.push(cachePlugins);
      }
      middleWaresFn.push(logPlugins);
      const middleWares = middleWaresFn.map((fn: Function) => fn(state));
      return StoreUtils.compose(middleWares)(rootDispatch);
    },
    [plugins]
  )(state);

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
    getState(path?: string, defaultValue?: any) {
      if (isString(path)) {
        return get(state, path, defaultValue || {});
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
