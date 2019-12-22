/**
 * @file fetch all api
 */
import { useState, useMemo } from 'react';
import { isArray, isFunction, get } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

interface Obj {
  fetch: () => any;
  handle?: (data: any) => any;
}

type Config = Array<Obj>;

function useFetchAll(config: Config, deps: Array<any> = []): Array<any> {
  if (!isArray(config)) {
    error('make sure the input is array');
    return [];
  }
  const [data, renderData] = useState([]);
  return useMemo(() => {
    const promiseList = config.map((item: Obj) => {
      return isPromise(item.fetch) ? item.fetch : Promise.resolve(item.fetch);
    });
    Promise.all(promiseList).then((response: Array<any>) => {
      const result = response.map((res: any, index: number) => {
        const handle = get(config, `[${index}].handle`, null);
        return isFunction(handle) ? handle(res) : res;
      });
      // @ts-ignore
      renderData(result);
    });
    return data;
  }, deps);
}

export default useFetchAll;
