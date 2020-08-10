/**
 * @file the fetch base on the dependent relationship between two api
 * todo: 该钩子的调用形式和配置项是否需要进一步优化
 */
import { useState, useCallback } from 'react';
import { isFunction } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

type Fetch = (params?: any) => Promise<any>;

interface Options {
  main: Fetch; // 提供项
  rely: Fetch; // 依赖项
  initValue?: any;
  paramsFn?: (params: Params1) => any;
  onSuccess?: (response: any, setResponse: (data: any) => any) => void;
  onError?: (response: any, setResponse: (data: any) => any) => any;
  closeLoading: boolean;
}

interface Params {
  main: any;
  rely: any;
}

interface Params1 {
  mainParams: any;
  relyParams: any;
}

interface Result {
  response: Params;
  start: (params: Params) => any;
  loading: boolean;
}

function useRelyFetch(options: Options, deps: Array<any>): Result {
  const { main, rely, initValue = {}, paramsFn, onSuccess, onError, closeLoading = false } = options;
  if (!isFunction(main)) {
    error('the main of options must be exist and be Promise type.');
  }

  if (!isFunction(rely)) {
    error('the rely of options must be exist and be Promise type.');
  }

  const [response, setResponse] = useState(initValue);
  const [loading, setLoading] = useState(false);

  const loadFn = useCallback((status: boolean) => {
    !closeLoading && setLoading(status);
  }, []);

  const start = useCallback((params: Params) => {
    setLoading(true);
    const promise = main(params.main);
    if (!isPromise(promise)) {
      setLoading(false);
      error('the options of main must be Promise for return');
    }
    promise
      .then((mainData: any) => {
        const realPath = isFunction(paramsFn)
          ? paramsFn({ mainParams: mainData, relyParams: params.rely })
          : { relyParams: params.rely, mainParams: mainData };
        const promise1 = rely(realPath);
        if (!isPromise(promise1)) {
          setLoading(false);
          error('the options of rely must be Promise for return');
        }
        promise1
          .then((relyData: any) => {
            loadFn(false);
            if (isFunction(onSuccess)) {
              const setData: (result: any) => void = (result: any) => {
                setResponse({ main: mainData, rely: result });
              };
              onSuccess(relyData, setData);
            } else {
              setResponse({ rely: relyData, main: mainData });
            }
          })
          .catch((error: Error) => {
            loadFn(false);
            if (isFunction(onError)) {
              onError(error, setResponse);
            } else {
              throw error;
            }
          });
      })
      .catch((error: Error) => {
        loadFn(false);
        if (isFunction(onError)) {
          onError(error, setResponse);
        } else {
          throw error;
        }
      });
  }, deps);

  return { response, start, loading };
}

export default useRelyFetch;
