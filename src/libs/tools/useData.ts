/**
 * @file the data structure for useState by input
 */
import { useState, useMemo, useCallback } from 'react';
import { isType } from '../../utils/tools';
import { error } from '../../utils/log';
import { set } from 'lodash';

interface ReturnValue {
  data: any;
  changeData: (path?: string, value?: any) => any;
}

function useData(value: object): ReturnValue {
  if (!isType('object', value)) {
    error('please check the type of input, the input of useData must be object type!');
    return { data: value, changeData: () => {} };
  }

  const [data, setData] = useState(value);
  const changeData = useCallback(() => {
    return (path: string, newValue: any) => {
      if (!isType('string', path)) {
        error('the path in changeData must be string');
        return;
      }
      if (!path) {
        error('the path in changeData can not be undefined!');
        return;
      }
      const targetValue = set(value, path, newValue);
      setData(targetValue);
    };
  }, []);
  return useMemo(() => {
    return { data, changeData };
  }, [data]);
}

export default useData;
