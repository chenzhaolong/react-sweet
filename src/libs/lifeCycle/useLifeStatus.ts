/**
 * @file get the status of life cycle for functional component
 * todo:后续可以根据某些依赖来计算出他的update次数
 */

import { useMemo, useRef, useCallback } from 'react';
import { isObject } from 'lodash';
import { error } from '../../utils/log';

interface Value {
  status: string;
  updateTimes: number;
  deps?: Array<string>;
}

type a = { [index: string]: any };

function useLifeStatus(trace?: a): Value {
  const render = useRef({ status: 'mount', updateTimes: 0, deps: [] });

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

  if (trace) {
    if (!isObject(trace)) {
      error('trace of input param must be Object type!');
      return { status: '', updateTimes: 0 };
    }
    const depsKey: Array<string> = Object.keys(trace);
    // @ts-ignore
    render.current.deps = depsKey;
    // @ts-ignore
    const depsValue = depsKey.map((key: string) => trace[key]);
    return useMemo(() => {
      return fn();
    }, depsValue);
  } else {
    return fn();
  }
}

export default useLifeStatus;
