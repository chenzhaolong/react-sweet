/**
 * @file the polling fetch of react hook
 */
import { useState, useCallback } from 'react';
import { isFunction } from 'lodash';
import { error } from '../../utils/log';

interface Polling {
  result: any;
  start: () => any;
}

interface Options {
  timeout?: number;
  terminate: (data: any) => boolean;
  deps?: Array<any>;
  initValue?: any;
}

type Func = () => any;

function usePolling(callback: Func, options: Options): Polling {
  const { timeout = 0, ternimate, deps = [], initValue = {} } = options;
  if (!isFunction(ternimate)) {
    error('the terminate of options must be exist.');
    return { result: {}, start: () => {} };
  }
  const [result, setResult] = useState(initValue || {});
  const start = useCallback(() => {
    // @ts-ignore
    callback && callback.call(null, callback.arguments, changeData);
  }, []);

  return { result, start: start.bind(null, setResult) };
}

export default usePolling;
