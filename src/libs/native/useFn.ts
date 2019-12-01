/**
 * @file debounce and throttle for function
 */
import { useMemo } from 'react';
import { error } from '../../utils/log';
import { hasProperty, isArray } from '../../utils/tools';
import { isString } from 'lodash';

interface Options {
  times: number;
  type: string;
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
    const diff = start - curTime;
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

function checkOptions(options: Options): boolean {
  if (!options) {
    error('the second params of useFn must be exist!');
    return false;
  }

  if (Object.keys(options).length === 0) {
    error('the second params of useFn can not be empty object!');
    return false;
  }

  if (!hasProperty(options, 'type') || !hasProperty(options, 'times')) {
    error('the second params of useFn must has the property of "times" and "type"!');
    return false;
  }

  return true;
}

function useFn(cb: () => any, options: Options, deps: Array<any> | string) {
  const result = checkOptions(options);
  if (!result) {
    return;
  }
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

  const realDeps: Array<any> = [options.times];
  if (deps && isArray(deps)) {
    realDeps.concat(deps);
  } else if (deps && isString(deps)) {
    realDeps.push(deps);
  }

  return useMemo(() => {
    return fn(cb, options.times);
  }, realDeps);
}

export default useFn;
