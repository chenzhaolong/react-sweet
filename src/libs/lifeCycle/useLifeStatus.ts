/**
 * @file get the status of life cycle for functional component
 */

import { useEffect, useRef } from 'react';

interface Value {
  status: string;
  updateTimes: number;
}

function useLifeStatus(): Value {
  const render = useRef({ status: 'mount', updateTimes: 0 });
  useEffect(() => {
    if (render.current.status === 'mount') {
      render.current.status = 'mounted';
    } else if (render.current.status === 'mounted') {
      render.current.status = 'update';
      render.current.updateTimes = 1;
    } else if (render.current.status === 'update') {
      render.current.updateTimes = render.current.updateTimes + 1;
    }
  });
  return render.current;
}

export default useLifeStatus;