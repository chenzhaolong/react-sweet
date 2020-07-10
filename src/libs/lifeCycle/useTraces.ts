/**
 * @file get the status of life cycle for functional component
 * todo:后续可以根据某些依赖来计算出他的update次数
 */

import { useMemo, useRef } from 'react';
import { isObject, isEqual } from 'lodash';
import { error } from '../../utils/log';
import { formatDate } from '../../utils/tools';

interface Value1 {
  updateTimes: number;
  dep: string;
  prevUpdateTime: string;
  currentUpdateTime: string;
  prevValue: any;
  currentValue: any;
}

type Value2 = Array<Value1>;

type Render = { current: Value2 };

interface Options {
  [key: string]: any;
}

function useTraces(trace: Options): Value2 {
  if (!isObject(trace)) {
    error('trace of input param must be Object type when use the hook of useTraces!');
  }

  const depsKey: Array<string> = Object.keys(trace);
  const defaultValue: Value2 = useMemo(() => {
    return depsKey.map((key: string) => {
      return {
        updateTimes: 0,
        dep: key,
        prevUpdateTime: '',
        currentUpdateTime: formatDate(new Date()),
        currentValue: trace[key],
        prevValue: ''
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const render: Render = useRef(defaultValue);
  const depsValue = depsKey.map((key: string) => trace[key]);

  return useMemo(() => {
    const traces: Value2 = render.current;
    const result: Value2 = traces.map((item: Value1) => {
      if (!isEqual(item.currentValue, trace[item.dep])) {
        return {
          dep: item.dep,
          updateTimes: item.updateTimes + 1,
          prevUpdateTime: item.currentUpdateTime,
          currentUpdateTime: formatDate(new Date()),
          currentValue: trace[item.dep],
          prevValue: item.currentValue
        };
      } else {
        return item;
      }
    });
    render.current = result;
    return render.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depsValue);
}

export default useTraces;
