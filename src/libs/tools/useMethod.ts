/**
 * @file input the data and optional function, it will return the
 * business function
 */
import { useState, useMemo } from 'react';
import { isFunction } from 'lodash';
import { error } from '../../utils/log';

interface Fn {
  value: any;
  trigger: () => any;
}

function useMethod(initValue: any, fn: (val: any, args: Array<any>) => any, deps: Array<any> = []): Fn {
  const [value, setRender] = useState(initValue);
  if (!isFunction(fn)) {
    error('the second params of input must be the type of function');
  }
  const trigger = useMemo(() => {
    return (...args: any): void => {
      setRender((val: any) => fn(val, ...args));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return { value, trigger };
}

export default useMethod;
