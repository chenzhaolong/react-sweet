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

function useLogic(data: any, fn: (val: any, args: Array<any>) => any): Fn {
  const [value, setRender] = useState(data);
  if (!isFunction(fn)) {
    error('the second params of input must be the type of function');
  }
  const trigger = useMemo(() => {
    return (...args: Array<any>) => {
      setRender((val: any) => fn(val, ...args));
    };
  }, []);
  return { value, trigger };
}

export default useLogic;
