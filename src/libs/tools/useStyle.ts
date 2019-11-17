/**
 * @file the dynamic css style
 */
import { useMemo } from 'react';
import { error, warning } from '../../utils/log';
import { hasProperty } from '../../utils/tools';

function handleByObject(originStyle: object, mapping: object): object {
  const keys = Object.keys(mapping);
  let targetStyle = {};
  keys.forEach((key) => {
    // @ts-ignore
    if (hasProperty(originStyle, key) && mapping[key]) {
      // @ts-ignore
      targetStyle = originStyle[key];
    }
  });
  return targetStyle;
}

function useStyle(style: object, second?: any, deps?: Array<any>): object {
  const saveStyle = useMemo(() => {
    if (second && typeof second === 'object') {
      return handleByObject(style, second);
    } else if (second && typeof second === 'function') {
      const handleStyle = second(style);
      if (handleStyle) {
        return handleStyle;
      } else {
        warning('if the second params is function, please make the function has return in the useStyle.');
        return {};
      }
    } else {
      error('the second params of useStyle must be object or function');
      return {};
    }
  }, deps);

  return saveStyle;
}

export default useStyle;
