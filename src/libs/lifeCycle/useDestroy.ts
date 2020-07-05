/**
 * @file the destroy of life cycle in react hook for functional component
 */
import { useEffect } from 'react';
import { error } from '../../utils/log';
import { isFunction } from 'lodash';

function useDestroy(cb: () => void): void {
  if (!isFunction(cb)) {
    error('cb must exist and must be a function in useDestroy');
  }
  useEffect(() => {
    return cb;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useDestroy;
