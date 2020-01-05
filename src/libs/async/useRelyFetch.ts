/**
 * @file the fetch base on the dependent relationship between two api
 * todo: 该钩子的调用形式和配置项是否需要进一步优化，特别时when的语境
 */
import { useState, useCallback } from 'react';
import { isFunction, get } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Options {
  when: (data: any) => Promise<any>;
  initValue?: any;
  path?: string;
  onError?: (error: any) => any;
}

interface Result {
  result: any;
  start: (params: any) => any;
}

type Fetch = (params?: any) => Promise<any>;

const defaultResult = { result: {}, start: () => {} };

function useRelyFetch(fetch: Fetch, options: Options): Result {
  const { when, initValue = {}, onError, path } = options;
  if (!when || !isFunction(when)) {
    error('the first params of input must be exist and be Promise type.');
    return defaultResult;
  }

  const [result, setResult] = useState(initValue);

  const handleError = useCallback((e: any) => {
    if (onError && isFunction(onError)) {
      setResult(onError(e) || {});
    } else {
      throw e;
    }
  }, []);

  const start = useCallback((params: any) => {
    const promise1 = when(params);
    if (!isPromise(promise1)) {
      error('the function of when must be Promise type.');
    } else {
      promise1
        .then((data: any) => {
          fetch(data)
            .then((response: any) => {
              const res = path ? get(response, 'path') : response;
              setResult(res);
            })
            .catch((e: any) => {
              handleError(e);
            });
        })
        .catch((e: any) => {
          handleError(e);
        });
    }
  }, []);

  return { result, start };
}

export default useRelyFetch;
