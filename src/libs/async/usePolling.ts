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
  isError: boolean;
}

interface Options {
  intervalTime: number;
  terminate: (data: any) => boolean;
  initValue?: any;
  onError?: (error: any, setResponse: (data: any) => any) => any;
  onSuccess?: (data: any, setResponse: (data: any) => any) => void;
  onCompleteByLimitNumber?: (setResponse: (data: any) => any) => void;
  onCompleteByLimitTime?: (setResponse: (data: any) => any) => void;
  onReset?: (setResponse: (data: any) => any) => void;
  limitPollingNumber?: number;
  limitPollingTime?: number;
  closeLoading?: boolean;
  deps?: Array<any>;
}

type Func = (params?: any) => any;

function usePolling(callback: Func, options: Options): Polling {
  const {
    intervalTime = 0,
    terminate,
    initValue = {},
    closeLoading = false,
    limitPollingNumber,
    limitPollingTime,
    onError,
    onSuccess,
    onCompleteByLimitNumber,
    onCompleteByLimitTime,
    onReset,
    deps = []
  } = options;

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
  const [isError, setError] = useState(false);
  const pollingInfo = useRef({ number: 0, currentTime: 0, isStop: false, timer: null, destroy: false });

  const clearTimer = useCallback((timer: any, isError = false) => {
    setLoading(false);
    setError(isError);
    // @ts-ignore
    timer && clearTimeout(timer);
    pollingInfo.current.timer = null;
    pollingInfo.current.number = 0;
    pollingInfo.current.currentTime = 0;
  }, []);

  const start = useCallback((params: any) => {
    // 限制轮询次数
    if (isNumber(limitPollingNumber) && pollingInfo.current.number >= limitPollingNumber) {
      if (isFunction(onCompleteByLimitNumber)) {
        onCompleteByLimitNumber(setResponse);
      } else {
        setResponse(initValue);
      }
      return clearTimer(pollingInfo.current.timer);
    }

    // 限制轮询时间
    if (
      isNumber(limitPollingTime) &&
      pollingInfo.current.currentTime > 0 &&
      Date.now() - pollingInfo.current.currentTime > limitPollingTime
    ) {
      if (isFunction(onCompleteByLimitTime)) {
        onCompleteByLimitTime(setResponse);
      } else {
        setResponse(initValue);
      }
      return clearTimer(pollingInfo.current.timer);
    }

    !closeLoading && setLoading(true);
    pollingInfo.current.number += 1;
    // 第一次轮询
    if (pollingInfo.current.number === 1) {
      pollingInfo.current.currentTime = Date.now();
      pollingInfo.current.isStop = false;
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
            clearTimer(pollingInfo.current.timer);
          } else {
            // 处理临界点：当触发reset时，正好发起了一条异步，此时要做拦截
            if (pollingInfo.current.isStop) {
              return !pollingInfo.current.destroy && clearTimer(pollingInfo.current.timer);
            }
            // @ts-ignore
            pollingInfo.current.timer = setTimeout(() => {
              start(params);
            }, intervalTime);
          }
        })
        .catch((e: any) => {
          clearTimer(pollingInfo.current.timer, true);
          if (onError && isFunction(onError)) {
            onError(e, setResponse);
          }
        });
    }
  }, deps);

  const reset = useCallback((initData: any) => {
    pollingInfo.current.isStop = true;
    clearTimer(pollingInfo.current.timer);
    if (isFunction(onReset)) {
      onReset(setResponse);
    } else {
      const data = initData ? initData : initValue;
      setResponse(data);
    }
  }, []);

  // 销毁时清除定时器
  useEffect(() => {
    return () => {
      pollingInfo.current.isStop = true;
      // 防止在销毁组件时还存在一条异步请求，执行state更新
      pollingInfo.current.destroy = true;
      clearTimer(pollingInfo.current.timer);
    };
  }, []);

  return { response, start, reset, loading, isError };
}

export default usePolling;
