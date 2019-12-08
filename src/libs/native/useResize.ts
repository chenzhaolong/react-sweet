/**
 * @file window resize hooks
 */
import { useEffect, useMemo } from 'react';

function debounce(fn: (e: object) => any, delay: number): () => any {
  let timeout: any;
  return function(...rest: any) {
    if (timeout) {
      clearTimeout(timeout);
    }
    // @ts-ignore
    const context = this;
    const arg = rest;
    timeout = setTimeout(() => {
      fn.apply(context, arg);
    }, delay);
  };
}

function useResize(callback: (e: object) => any) {
  const resizeFn = useMemo(() => {
    return debounce(callback, 605);
  }, []);
  useEffect(() => {
    window.onresize = function(e: object) {
      // @ts-ignore
      resizeFn(e);
    };
    return () => {
      window.onresize = null;
    };
  }, []);
}

export default useResize;
