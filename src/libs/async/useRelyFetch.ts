/**
 * @file the fetch base on the dependent relationship between two api
 * todo: 该钩子的调用形式和配置项是否需要进一步优化
 */
import { useState, useCallback } from 'react';
import { isFunction } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

enum Type {
  MAIN = 'main',
  RELY = 'rely'
}

type Fetch = (params?: any) => Promise<any>;

interface Options {
  main: Fetch; // 提供项
  rely: Fetch; // 依赖项
  initValue?: any;
  relyParams?: (outerParams: any, innerParams: any) => any;
  mainHandle?: (error: any, response: any, setResponse: (data: any) => any) => void;
  relyHandle?: (error: any, response: any, setResponse: (data: any) => any) => void;
  closeLoading: boolean;
}

interface Result {
  response: { main: any; rely: any };
  start: (type: Type, params: any) => any;
  loading: boolean;
}

interface Deps {
  main: Array<any>;
  rely: Array<any>;
}

function useRelyFetch(options: Options, deps: Deps): Result {
  const { main, rely, initValue = {}, relyParams, mainHandle, relyHandle, closeLoading = false } = options;
  if (!isFunction(main)) {
    error('the main of options must be exist and be Promise type.');
  }

  if (!isFunction(rely)) {
    error('the rely of options must be exist and be Promise type.');
  }

  const [response, setResponse] = useState(initValue);
  const [loading, setLoading] = useState(false);

  const mainDeps = deps.main || [];
  const relyDeps = deps.rely || [];

  const loadFn = useCallback((status: boolean) => {
    !closeLoading && setLoading(status);
  }, []);

  const fetchMain = useCallback((params: any) => {
    setLoading(true);
    const promise = main(params);
    if (!isPromise(promise)) {
      setLoading(false);
      error('the options of main must be Promise for return');
    }
    promise
      .then((data: any) => {
        loadFn(false);
        if (isFunction(mainHandle)) {
          const setData = (res: any) => {
            setResponse({ main: res, rely: response.rely });
          };
          mainHandle(null, data, setData);
        } else {
          setResponse({ main: data, rely: response.rely });
        }
      })
      .catch((error: Error) => {
        loadFn(false);
        if (isFunction(mainHandle)) {
          const setData = (res: any) => {
            setResponse({ main: res, rely: response.rely });
          };
          mainHandle(error, '', setData);
        } else {
          throw error;
        }
      });
  }, mainDeps);

  const fetchRely = useCallback((params: { main: any; rely: any }) => {
    setLoading(true);
    const promise = main(params.main);
    if (!isPromise(promise)) {
      setLoading(false);
      error('the options of main must be Promise for return');
    }
    promise
      .then((data: any) => {
        const realPath = isFunction(relyParams) ? relyParams(params.rely, data) : { outer: params.rely, inner: data };
        const promise1 = rely(realPath);
        if (!isPromise(promise1)) {
          setLoading(false);
          error('the options of rely must be Promise for return');
        }
        promise1
          .then((data1: any) => {
            loadFn(false);
            if (isFunction(relyHandle)) {
              const setData = (res: any) => {
                setResponse({ rely: res, main: response.main });
              };
              relyHandle(null, data, setData);
            } else {
              setResponse({ rely: data1, main: response.main });
            }
          })
          .catch((error: Error) => {
            loadFn(false);
            if (isFunction(mainHandle)) {
              const setData = (res: any) => {
                setResponse({ rely: res, main: response.main });
              };
              mainHandle(error, '', setData);
            } else {
              throw error;
            }
          });
      })
      .catch((error: Error) => {
        loadFn(false);
        if (isFunction(relyHandle)) {
          const setData = (res: any) => {
            setResponse({ main: response.main, rely: res });
          };
          relyHandle(error, '', setData);
        } else {
          throw error;
        }
      });
  }, relyDeps);

  const start = useCallback((type: Type, params: any) => {
    if (type && !params) {
      params = type;
      type = Type.MAIN;
    }
    if (type === Type.MAIN) {
      fetchMain(params);
    } else {
      fetchRely(params);
    }
  }, []);

  return { response, start, loading };
}

export default useRelyFetch;
