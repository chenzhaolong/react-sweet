/**
 * @file the mount of life cycle in react hook for functional component
 */

import { useEffect } from 'react';

function useMount(cb: () => void): void {
  useEffect(() => {
    cb();
    console.log('awer');
  }, []);
}

export default useMount;
