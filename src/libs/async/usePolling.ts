/**
 * @file the polling fetch of react hook
 * fit to the params of callback is not changed;
 * todo: 后续可以提供选项限制usePolling的轮询次数；
 * todo：后续将结束的状态细分为终止，成功终止，失败终止三种终止条件；
 * todo: 后续可以提供终止时对返回的数据进行转换的功能；
 */
import { useState, useCallback, useEffect } from 'react';
import { isFunction, isBoolean } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Polling {
  result: any;
  start: (params: any) => any;
  reset: (initData?: any) => void;
}

interface Options {
  timeout?: number;
  terminate: (data: any) => boolean;
  initValue?: any;
}

type Func = () => any;

const defaultResult = { result: {}, start: () => {}, reset: () => {} };

function usePolling(callback: Func, options: Options): Polling {
  const { timeout = 0, terminate, initValue = {} } = options;
  let timer: any = null;

  if (!isFunction(terminate)) {
    error('the terminate of options must be exist.');
    return defaultResult;
  }
  if (!isFunction(callback)) {
    error('the first params of input must be function type.');
    return defaultResult;
  }

  const [result, setResult] = useState(initValue || {});

  const clearTime = useCallback(() => {
    timer && clearTimeout(timer);
  }, []);

  const start = useCallback((params: any) => {
    const promise = callback(params);
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
              clearTime();
              setResult(response);
            } else {
              timer = setTimeout(() => {
                return start(params);
              }, timeout);
            }
          }
        })
        .catch((e: any) => {
          throw e;
        });
    }
  }, []);

  const reset = useCallback((initData: any) => {
    clearTime();
    const data = initData ? initData : initValue;
    setResult(data);
  }, []);

  // 销毁时清除定时器
  useEffect(() => {
    return () => {
      clearTime();
    };
  }, []);

  return { result, start, reset };
}

export default usePolling;
