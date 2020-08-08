/**
 * @file the polling fetch of react hook
 * fit to the params of callback is not changed;
 * todo：后续将结束的状态细分为终止，成功终止，失败终止三种终止条件；
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { isFunction, isBoolean, isNumber } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Polling {
  result: any;
  loading: boolean;
  start: (params: any) => any;
  reset: (initData?: any) => void;
}

interface Options {
  intervalTime?: number;
  terminate: (data: any) => boolean;
  initValue?: any;
  onError?: (error: any) => any;
  onSuccess?: (data: any, setResponse: (data: any) => any) => void;
  onCompleteByLimitNumber?: (setResponse: (data: any) => any) => void;
  limitPollingNumber: number;
  closeLoading?: boolean;
}

type Func = () => any;

function usePolling(callback: Func, options: Options): Polling {
  const {
    intervalTime = 0,
    terminate,
    initValue = {},
    onError,
    closeLoading = false,
    limitPollingNumber,
    onSuccess,
    onCompleteByLimitNumber
  } = options;
  let timer: any = null;

  if (!isFunction(terminate)) {
    error('the terminate of options must be exist.');
  }
  if (!isFunction(callback)) {
    error('the first params of input must be function type.');
  }

  const [result, setResponse] = useState(initValue || {});
  const [loading, setLoading] = useState(false);
  const pollingNumber = useRef({ number: 0 });

  const clearTime = useCallback(() => {
    setLoading(false);
    timer && clearTimeout(timer);
  }, [timer]);

  const start = useCallback((params: any) => {
    if (isNumber(limitPollingNumber) && pollingNumber.current.number >= limitPollingNumber) {
      pollingNumber.current.number = 0;
      if (isFunction(onCompleteByLimitNumber)) {
        onCompleteByLimitNumber(setResponse);
      } else {
        setResponse(initValue);
      }
      return clearTime();
    }

    !closeLoading && setLoading(true);
    pollingNumber.current.number += 1;
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
              if (isFunction(onSuccess)) {
                onSuccess(response, setResponse);
              } else {
                setResponse(response);
              }
            } else {
              if (isNumber(intervalTime)) {
                timer = setTimeout(() => {
                  start(params);
                }, intervalTime);
              } else {
                start(params);
              }
            }
          }
        })
        .catch((e: any) => {
          setLoading(false);
          if (onError && isFunction(onError)) {
            const data = onError(e);
            setResponse(data || {});
          } else {
            throw e;
          }
        });
    }
  }, []);

  const reset = useCallback((initData: any) => {
    clearTime();
    const data = initData ? initData : initValue;
    setResponse(data);
  }, []);

  // 销毁时清除定时器
  useEffect(() => {
    return () => {
      console.log('destory');
      clearTime();
    };
  }, []);

  return { result, start, reset, loading };
}

export default usePolling;
