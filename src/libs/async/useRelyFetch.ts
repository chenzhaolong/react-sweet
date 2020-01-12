/**
 * @file the fetch base on the dependent relationship between two api
 * todo: 该钩子的调用形式和配置项是否需要进一步优化，特别时when的语境
 */
import { useState, useCallback } from 'react';
import { isFunction, get } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Options {
  antecedents: Fetch; // 被依赖项
  consequence: Fetch; // 依赖项
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
  const { antecedents, consequence, initValue = {}, onError, path } = options;
  if (!antecedents || !isFunction(antecedents)) {
    error('the antecedents of options must be exist and be Promise type.');
    return defaultResult;
  }

  if (!consequence || !isFunction(consequence)) {
    error('the consequence of options must be exist and be Promise type.');
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
    const promise1 = antecedents(params);
    if (!isPromise(promise1)) {
      error('the function of when must be Promise type.');
    } else {
      promise1
        .then((data: any) => {
          consequence(data)
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
