/**
 * @file get the value by computed from the deps
 */
import { useMemo, useRef } from 'react';
import { isArray } from '../../utils/tools';
import { error, warning } from '../../utils/log';

type Value = { [index: string]: any };

type Target = { deps?: Array<any>; [index: string]: any };

type SaveData = { current: { [key: string]: any } };

function handleKV(target: Target): object {
  const deps = target.deps || [];
  const keys = Object.keys(target).filter((key) => key !== 'deps');
  return useMemo(() => {
    const value: Value = {};
    keys.forEach((key) => {
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

  const saveData: SaveData = useRef({});
  array.forEach((item: { deps?: Array<any> }) => {
    const temResult: Value = handleKV(item);
    const keys = Object.keys(temResult);
    keys.forEach((key) => {
      saveData.current[key] = temResult[key];
    });
  });
  return saveData.current;
}

export default useComputed;
