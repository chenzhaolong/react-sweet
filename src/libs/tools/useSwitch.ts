/**
 * @file the dynamic css style
 */
import { useMemo } from 'react';
import { error, warning } from '../../utils/log';
import { hasProperty, isType } from '../../utils/tools';

type Value = { [key: string]: number | string };

type Mapping = { [key: string]: boolean };

function handleByObject(originStyle: Value, mapping: Mapping): object {
  const keys = Object.keys(mapping);
  let targetStyle = {};
  keys.forEach((key) => {
    if (hasProperty(originStyle, key) && mapping[key]) {
      targetStyle = originStyle[key];
    }
  });
  return targetStyle;
}

function useSwitch(style: Value, condition: any, deps: Array<any> = []): object {
  const saveStyle = useMemo(() => {
    if (condition && isType('object', condition)) {
      return handleByObject(style, condition);
    } else if (condition && isType('function', condition)) {
      const handleStyle = condition(style);
      if (handleStyle) {
        return handleStyle;
      } else {
        warning('if the second params is function, please make the function has return in the useStyle.');
        return {};
      }
    } else {
      error('the second params of useStyle must be object or function');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return saveStyle;
}

export default useSwitch;
