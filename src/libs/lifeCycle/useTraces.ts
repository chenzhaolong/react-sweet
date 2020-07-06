/**
 * @file get the status of life cycle for functional component
 * todo:后续可以根据某些依赖来计算出他的update次数
 */

import { useMemo, useRef } from 'react';
import { isObject } from 'lodash';
import { error } from '../../utils/log';

interface Value {
  status: string;
  updateTimes: number;
  deps: Array<string>;
}

interface Options {
  [key: string]: any;
}

type Render = { current: Value };

function useTraces(trace: Options): Value {
  if (!isObject(trace)) {
    error('trace of input param must be Object type when use the hook of useTraces!');
  }

  const render: Render = useRef({ status: 'mount', updateTimes: 0, deps: [] });
  const depsKey: Array<string> = Object.keys(trace);
  render.current.deps = depsKey;
  const depsValue: Array<any> = depsKey.map((key: string) => trace[key]);

  return useMemo(() => {
    if (render.current.status === 'mount') {
      render.current.status = 'mounted';
    } else if (render.current.status === 'mounted') {
      render.current.status = 'update';
      render.current.updateTimes = 1;
    } else if (render.current.status === 'update') {
      render.current.updateTimes = render.current.updateTimes + 1;
    }
    return render.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depsValue);
}

export default useTraces;
