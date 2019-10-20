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

function useMount(cb: () => any | Params) {
  useEffect(() => {
    if (typeof cb === 'function') {
      return cb();
    } else {
      if (hasProperty(cb, 'mount', 'function')) {
        const mount: () => any = cb['mount'];
        const clean: () => void = cb['clean'];
        mount();
        return clean ? clean : () => {};
      } else {
        error('options of useMount must has property of mount!');
      }
    }
  }, []);
}

export default useMount;
