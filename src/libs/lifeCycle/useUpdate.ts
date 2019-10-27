/**
 * @file the update of life cycle in react hook for functional component
 */

import { useEffect, useRef } from 'react';

function useUpdate(cb: () => any, deps?: Array<any>) {
  const render = useRef({ isFirstRender: true });
  useEffect(() => {
    if (render.current.isFirstRender) {
      render.current.isFirstRender = false;
    } else {
      return cb();
    }
  }, deps);
}

export default useUpdate;
