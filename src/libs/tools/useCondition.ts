/**
 * @file the ref of component
 */
import { useMemo } from 'react';
import { isBoolean } from 'lodash';
import { warning } from '../../utils/log';

type condition1 = boolean;

type condition2 = () => boolean;

interface Options {
  yes: object;
  no: object;
  condition: condition1 | condition2;
}

function useCondition(options: Options, deps?: Array<any>): any {
  return useMemo(() => {
    const { yes, no, condition } = options;
    const result = typeof condition === 'function' ? condition() : condition;
    if (!isBoolean(result)) {
      warning('condition must return boolean in useCondition.');
      return '';
    }
    if (result) {
      return typeof yes === 'function' ? yes() : yes;
    } else {
      return typeof no === 'function' ? no() : no;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useCondition;
