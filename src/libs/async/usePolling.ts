/**
 * @file the polling fetch of react hook
 * fit to the params of callback is not changed;
 * todo：后续支持暂时停止，然后恢复轮询
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { isFunction, isBoolean, isNumber } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Polling {
  response: any;
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
  onCompleteByLimit?: (setResponse: (data: any) => any) => void;
  limitPollingNumber: number;
  limitPollingTime: number;
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
    onCompleteByLimit,
    limitPollingTime
  } = options;
  const timer: any = null;

  if (!isFunction(terminate)) {
    error('the terminate of options must be exist.');
  }
  if (!isNumber(intervalTime)) {
    error('the intervalTime of options must be exist.');
  }
  if (!isFunction(callback)) {
    error('the first params of input must be function type.');
  }

  const [response, setResponse] = useState(initValue || {});
  const [loading, setLoading] = useState(false);
  const pollingNumber = useRef({ number: 0, currentTime: 0 });

  const resetData = useCallback(() => {
    setLoading(false);
    pollingNumber.current.number = 0;
    pollingNumber.current.currentTime = 0;
  }, []);

  const start = useCallback(
    (params: any) => {
      // 限制轮询次数
      if (isNumber(limitPollingNumber) && pollingNumber.current.number >= limitPollingNumber) {
        if (isFunction(onCompleteByLimit)) {
          onCompleteByLimit(setResponse);
        } else {
          setResponse(initValue);
        }
        // @ts-ignore
        timer && clearTimeout(timer);
        return resetData();
      }

      // 限制轮询时间
      if (
        isNumber(limitPollingTime) &&
        pollingNumber.current.currentTime > 0 &&
        Date.now() - pollingNumber.current.currentTime > limitPollingTime
      ) {
        if (isFunction(onCompleteByLimit)) {
          onCompleteByLimit(setResponse);
        } else {
          setResponse(initValue);
        }
        // @ts-ignore
        timer && clearTimeout(timer);
        return resetData();
      }

      !closeLoading && setLoading(true);
      pollingNumber.current.number += 1;
      if (pollingNumber.current.number === 1) {
        pollingNumber.current.currentTime = Date.now();
      }

      const promise = callback(params);
      if (!isPromise(promise)) {
        error('the first params of input must be Promise.');
      } else {
        promise
          .then((response: any) => {
            const isNotPolling = terminate(response);
            if (!isBoolean(isNotPolling)) {
              error('the return of terminate must be Boolean type.');
            }
            if (isNotPolling) {
              if (isFunction(onSuccess)) {
                onSuccess(response, setResponse);
              } else {
                setResponse(response);
              }
              resetData();
            } else {
              // @ts-ignore
              timer = setTimeout(() => {
                start(params);
              }, intervalTime);
            }
          })
          .catch((e: any) => {
            resetData();
            if (onError && isFunction(onError)) {
              const data = onError(e);
              setResponse(data || {});
            } else {
              throw e;
            }
          });
      }
    },
    [timer]
  );

  const reset = useCallback(
    (initData: any) => {
      // @ts-ignore
      timer && clearTimeout(timer);
      resetData();
      const data = initData ? initData : initValue;
      setResponse(data);
    },
    [timer]
  );

  // 销毁时清除定时器
  useEffect(() => {
    return () => {
      console.log('destory');
      // @ts-ignore
      timer && clearTimeout(timer);
      resetData();
    };
  }, []);

  return { response, start, reset, loading };
}

export default usePolling;
