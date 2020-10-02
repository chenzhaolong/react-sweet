/**
 * @file the data structure for useState by input
 */
import { useState, useCallback } from 'react';
import { isType, getType } from '../../utils/tools';
import { error } from '../../utils/log';
import { set, get, cloneDeep } from 'lodash';

interface ReturnValue {
  data: any;
  changeData: (path: string, value: any) => void;
}

/**
 * 浅比较
 * @param obj1 {any} 对象
 * @param obj2 {any} 对象
 * @return {boolean} 返回值
 */
export function shadowEqual(obj1: object, obj2: object): boolean {
  const obj1Key = Object.keys(obj1);
  const obj2Key = Object.keys(obj2);
  if (obj1Key.length !== obj2Key.length) {
    return false;
  }

  return obj1Key.some((key) => {
    if (obj2.hasOwnProperty(key)) {
      // @ts-ignore
      return obj1[key] !== obj2[key];
    } else {
      return true;
    }
  });
}

function different(oldValue: any, newValue: any): boolean {
  const oldType = getType(oldValue);
  const newType = getType(newValue);
  if (oldType !== newType) {
    return true;
  }

  // add
  if (!oldValue) {
    return true;
  }

  // string
  if (isType('string', oldValue)) {
    return oldValue !== newValue;
  }

  // array
  if (isType('array', oldValue)) {
    return oldValue.length !== newValue.length;
  }

  // object
  if (isType('object', oldValue)) {
    return shadowEqual(oldValue, newValue);
  }

  // default
  return true;
}

function useData(value: object): ReturnValue {
  if (!isType('object', value)) {
    error('please check the type of input, the input of useData must be object type!');
  }

  const [data, setData] = useState(value);

  const changeData = useCallback((source: any) => {
    return (path: string, newValue: any) => {
      if (!isType('string', path)) {
        error('the path in changeData must be string');
      }
      if (!path) {
        error('the path in changeData can not be undefined!');
      }
      const oldValue = get(source, path, '');
      if (different(oldValue, newValue)) {
        const targetValue = set(source, path, newValue);
        setData(cloneDeep(targetValue));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])(data);

  return { data, changeData };
}

export default useData;
