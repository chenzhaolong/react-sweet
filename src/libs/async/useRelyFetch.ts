/**
 * @file the fetch base on the dependent relationship between two api
 */
import { useState, useCallback } from 'react';
import { isFunction, isObject } from 'lodash';
import { error } from '../../utils/log';
import { isPromise, hasProperty } from '../../utils/tools';

interface Options {
  main: (params: any) => Promise<any>; // 提供项
  rely: (params: Params1) => Promise<any>; // 依赖项
  initValue?: any;
  paramsFn?: (params: Params1) => any;
  onSuccess?: (response: Params, setResponse: (mainData: any, relyData: any) => any) => void;
  onError?: (error: any, type: string, setResponse: (mainData: any, relyData: any) => any) => void;
  closeLoading: boolean;
}

interface Params1 {
  mainData: any;
  relyParams: any;
}

interface Params {
  mainData: any;
  relyData: any;
}

interface Params2 {
  mainParams: any;
  relyParams: any;
}

interface Result {
  response: Params;
  start: (params: Params2) => any;
  loading: boolean;
  isError: boolean;
}

function useRelyFetch(options: Options, deps: Array<any>): Result {
  const { main, rely, initValue = {}, paramsFn, onSuccess, onError, closeLoading = false } = options;
  if (!isFunction(main)) {
    error('the main of options must be exist and be Promise type.');
  }

  if (!isFunction(rely)) {
    error('the rely of options must be exist and be Promise type.');
  }

  if (initValue) {
    if (!isObject(initValue)) {
      error('the initValue of options must object type.');
    }
    if (!hasProperty(initValue, 'mainData')) {
      error('the mainData of initValue must exist.');
    }
    if (!hasProperty(initValue, 'relyData')) {
      error('the relyData of initValue must exist.');
    }
  }

  deps = deps || [];
  const [response, setResponse] = useState(initValue || { mainData: {}, relyData: {} });
  const [loading, setLoading] = useState(false);
  const [isError, setError] = useState(false);

  const loadFn = useCallback((status: boolean) => {
    !closeLoading && setLoading(status);
  }, []);

  const start = useCallback((params: Params2) => {
    const setData = (mainData: any, relyData: any) => {
      setResponse({ mainData: mainData || {}, relyData: relyData || {} });
    };

    setLoading(true);
    const mainPromise = main(params.mainParams);
    if (!isPromise(mainPromise)) {
      setLoading(false);
      error('the options of main must be Promise for return');
    }

    mainPromise
      .then((mainData: any) => {
        const realPath = isFunction(paramsFn)
          ? paramsFn({ mainData: mainData, relyParams: params.relyParams })
          : { mainData: mainData, relyParams: params.relyParams };

        const relyPromise = rely(realPath);
        if (!isPromise(relyPromise)) {
          setLoading(false);
          error('the options of rely must be Promise for return');
        }

        relyPromise
          .then((relyData: any) => {
            loadFn(false);
            setError(false);
            if (isFunction(onSuccess)) {
              onSuccess({ relyData, mainData }, setData);
            } else {
              setResponse({ relyData: relyData, mainData: mainData });
            }
          })
          .catch((error: Error) => {
            loadFn(false);
            setError(true);
            isFunction(onError) && onError(error, 'rely', setData);
          });
      })
      .catch((error: Error) => {
        loadFn(false);
        setError(true);
        isFunction(onError) && onError(error, 'main', setData);
      });
  }, deps);

  return { response, start, loading, isError };
}

export default useRelyFetch;
