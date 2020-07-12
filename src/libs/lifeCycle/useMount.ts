/**
 * @file the mount of life cycle in react hook for functional component
 */

import { useEffect } from 'react';
import { error } from '../../utils/log';
import { hasProperty } from '../../utils/tools';

interface Params {
  mount(): any;
  clean?(): void;
}

function useMount(cb: () => any | Params): void {
  useEffect(() => {
    if (typeof cb === 'function') {
      return cb();
    } else {
      if (hasProperty(cb, 'mount', 'function')) {
        const mount: () => any = cb['mount'];
        mount();
        if (hasProperty(cb, 'clean', 'function')) {
          const clean: () => any = cb['clean'];
          return clean;
        }
        return (): void => {};
      } else {
        error('options of useMount must has property of mount!');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useMount;
