/**
 * @file the fetch base on the dependent relationship between two api
 * todo: 该钩子的调用形式和配置项是否需要进一步优化
 */
import { useState, useCallback } from 'react';
import { isFunction, get } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Options {
  first: Fetch; // 被依赖项
  last: Fetch; // 依赖项
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

function useRelyFetch(options: Options): Result {
  const { first, last, initValue = {}, onError, path } = options;
  if (!first || !isFunction(first)) {
    error('the first of options must be exist and be Promise type.');
    return defaultResult;
  }

  if (!last || !isFunction(last)) {
    error('the last of options must be exist and be Promise type.');
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
    const promise1 = first(params);
    if (!isPromise(promise1)) {
      error('the function of when must be Promise type.');
    } else {
      promise1
        .then((data: any) => {
          last(data)
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
