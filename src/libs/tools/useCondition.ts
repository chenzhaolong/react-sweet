/**
 * @file the ref of component
 */
import { useMemo } from 'react';

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
    return result ? yes || null : no || null;
  }, deps);
}

export default useCondition;
