/**
 * @file the polling fetch of react hook
 * fit to the params of callback is not changed;
 * todo: 可以提供选项限制usePolling的轮询次数
 */
import { useState, useCallback } from 'react';
import { isFunction, isBoolean } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Polling {
  result: any;
  start: () => any;
}

interface Options {
  timeout?: number;
  terminate: (data: any) => boolean;
  initValue?: any;
}

type Func = () => any;

function usePolling(callback: Func, options: Options): Polling {
  const { timeout = 0, terminate, initValue = {} } = options;
  const defaultResult = { result: {}, start: () => {} };
  if (!isFunction(terminate)) {
    error('the terminate of options must be exist.');
    return defaultResult;
  }
  if (!isFunction(callback)) {
    error('the first params of input must be function type.');
    return defaultResult;
  }

  const [result, setResult] = useState(initValue || {});
  const start = useCallback(() => {
    const promise = callback();
    if (!isPromise(promise)) {
      error('the first params of input must be Promise.');
    } else {
      promise
        .then((response: any) => {
          const isNotPolling = terminate(response);
          if (!isBoolean(isNotPolling)) {
            error('the return of terminate must be Boolean type.');
          } else {
            if (isNotPolling) {
              setResult(response);
            } else {
              setTimeout(start, timeout);
            }
          }
        })
        .catch((e: any) => {
          throw e;
        });
    }
  }, []);

  return { result, start };
}

export default usePolling;
