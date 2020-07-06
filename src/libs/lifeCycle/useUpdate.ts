/**
 * @file the update of life cycle in react hook for functional component
 */

import { useEffect, useRef } from 'react';
import { isArray } from 'lodash';
import { error } from '../../utils/log';

function useUpdate(cb: () => any, deps?: Array<any>, errorMsg?: string): void {
  const render = useRef({ isFirstRender: true });
  if (isArray(deps) && deps.length === 0) {
    error(
      errorMsg ||
        'deps can not be empty array in useUpdate! if you want to set deps empty, you can use another hook called useMount.'
    );
  }
  useEffect(() => {
    if (render.current.isFirstRender) {
      render.current.isFirstRender = false;
    } else {
      return cb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export default useUpdate;
