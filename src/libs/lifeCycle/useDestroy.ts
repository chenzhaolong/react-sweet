/**
 * @file the destroy of life cycle in react hook for functional component
 */
import { useEffect } from 'react';
import { error } from '../../utils/log';

function useDestroy(cb: () => void) {
  useEffect(() => {
    if (cb && typeof cb === 'function') {
      return cb;
    } else {
      error('cb must exist and must be a function in useDestroy');
      return () => {};
    }
  }, []);
}

export default useDestroy;
