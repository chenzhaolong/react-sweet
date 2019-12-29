/**
 * @file fetch all api
 * todo: 后续为每一个key添加一个path，获取指定的数据
 */
import { useState, useEffect } from 'react';
import { isObject } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

type FetchList = { [key: string]: () => any };
type Obj = { [key: string]: any };

function useFetchAll(fetchList: FetchList, initValue?: Obj, deps: Array<any> = []): object {
  if (!isObject(fetchList)) {
    error('make sure the input is object');
    return {};
  }
  const fetchKey = Object.keys(fetchList);
  const result = fetchKey.every((key) => {
    return isPromise(fetchList[key]);
  });
  if (!result) {
    error('make sure each value of key of the first input is Promise');
    return {};
  }
  let realInitValue: Obj = {};
  if (initValue) {
    realInitValue = initValue;
  } else {
    fetchKey.forEach((key) => {
      realInitValue[key] = {};
    });
  }
  const [data, renderData] = useState(realInitValue);
  useEffect(() => {
    const promiseList = fetchKey.map((key) => fetchList[key]);
    Promise.all(promiseList)
      .then((response: Array<any>) => {
        const result: Obj = {};
        response.forEach((data, index) => {
          const key = fetchKey[index];
          result[key] = data;
        });
        renderData(result);
      })
      .catch((e) => {
        throw e;
      });
  }, deps);
  return data;
}

export default useFetchAll;
