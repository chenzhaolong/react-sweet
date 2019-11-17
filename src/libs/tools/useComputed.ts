/**
 * @file get the value by computed from the deps
 */
import { useMemo, useRef } from 'react';
import { isArray } from '../../utils/tools';
import { error, warning } from '../../utils/log';

function handleKV(target: { deps?: Array<any> }): object {
  const deps = target.deps || [];
  const keys = Object.keys(target).filter((key) => key !== 'deps');
  return useMemo(() => {
    const value = {};
    keys.forEach((key) => {
      // @ts-ignore
      value[key] = target[key]();
    });
    return value;
  }, deps);
}

function useComputed(array: any): object {
  if (!isArray(array)) {
    if (typeof array === 'object') {
      warning('you can use useMemo instead of useComputed in this situation.');
      return handleKV(array);
    } else {
      error('the params of useComputed is wrong, make sure the params is object or array.');
      return {};
    }
  }

  const saveData = useRef({});
  array.forEach((item: { deps?: Array<any> }) => {
    const temResult = handleKV(item);
    const keys = Object.keys(temResult);
    keys.forEach((key) => {
      // @ts-ignore
      saveData.current[key] = temResult[key];
    });
  });
  return saveData.current;
}

export default useComputed;
