/**
 * @file the polling fetch of react hook
 */
import { useState, useCallback } from 'react';
// import {isNumber} from 'lodash';
// import { error } from '../../utils/log';

interface Polling {
  result: any;
  start: () => any;
}

type Func = () => any;

function usePolling(callback: Func, initValue?: any): Polling {
  // if (!isNumber(time)) {
  //   error('the second input must be exist and must be number');
  //   return {result: '', start: () => {}};
  // }
  const [result, setResult] = useState(initValue || {});
  const start = useCallback((changeData) => {
    // @ts-ignore
    callback && callback.call(null, callback.arguments, changeData);
  }, []);

  return { result, start: start.bind(null, setResult) };
}

export default usePolling;
