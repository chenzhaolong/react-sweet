/**
 * @file debounce and throttle for function
 */
import { useMemo } from 'react';
import { error } from '../../utils/log';
import { hasProperty, isArray } from '../../utils/tools';

interface Options {
  time: number;
  type?: string;
}

function debounce(fn: () => any, delay: number): () => any {
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

function throttle(fn: () => any, threshold: number): () => any {
  let start = new Date().getTime();
  let timeout: any;
  return function(...rest: any) {
    if (timeout) {
      clearTimeout(timeout);
    }
    const curTime = new Date().getTime();
    // @ts-ignore
    const context = this;
    const arg = rest;
    const diff = curTime - start;
    if (diff >= threshold) {
      fn.apply(context, arg);
    } else {
      timeout = setTimeout(function() {
        fn.apply(context, arg);
      }, threshold);
    }
    start = curTime;
  };
}

function checkOptions(options: Options) {
  if (!options) {
    error('the second params of useFn must be exist!');
  }

  if (Object.keys(options).length === 0) {
    error('the second params of useFn can not be empty object!');
  }

  if (!hasProperty(options, 'time')) {
    error('the second params of useFn must has the property of "time"!');
  }
}

function useFn(cb: () => any, options: Options, deps: Array<any> | string) {
  checkOptions(options);
  let fn: {
    (fn: () => any, threshold: number): () => any;
    (fn: () => any, delay: number): () => any;
    (arg0: () => any, arg1: number): void;
  };
  if (options.type === 'throttle') {
    fn = throttle;
  } else {
    fn = debounce;
  }

  const realDeps: Array<any> = [options.time];
  if (deps && isArray(deps) && deps.length > 0) {
    realDeps.concat(deps);
  }

  return useMemo(() => {
    return fn(cb, options.time);
  }, realDeps);
}

export default useFn;
