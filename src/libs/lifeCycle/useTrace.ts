/**
 * @file get the status of life cycle for functional component
 */

import { useRef, useCallback } from 'react';

interface Value {
  status: string;
  updateTimes: number;
}

function useTrace(): Value {
  const render = useRef({ status: 'mount', updateTimes: 0 });
  const fn = useCallback(() => {
    if (render.current.status === 'mount') {
      render.current.status = 'mounted';
    } else if (render.current.status === 'mounted') {
      render.current.status = 'update';
      render.current.updateTimes = 1;
    } else if (render.current.status === 'update') {
      render.current.updateTimes = render.current.updateTimes + 1;
    }
    return render.current;
  }, []);
  return fn();
}

export default useTrace;
