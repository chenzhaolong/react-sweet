/**
 * @file fetch all api
 * todo: 后续为每一个key添加一个path，获取指定的数据
 * todo: 后续将每个配置项集中起来，并加上onError
 */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { isObject, isFunction } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

type FetchList = { [key: string]: () => Promise<any> };
type Obj = { [key: string]: any };

enum AutoFetchTimeType {
  MOUNT = 'mount',
  UPDATE = 'update'
}

interface Options {
  initValue?: { [key: string]: any };
  onError?: (e: Error) => any;
  onSuccess?: (data: object, setData: (data: any) => void) => void;
  closeLoading?: boolean;
  deps?: Array<any>;
  // autoFetch?: boolean;
  autoFetchMoment?: AutoFetchTimeType;
}

interface Result {
  readonly response?: object;
  // startFetch?: () => void;
  loading?: boolean;
}

function useFetchAll(fetchList: FetchList, options: Options): Result {
  if (!isObject(fetchList)) {
    error('make sure the input is object');
  }
  const fetchKey = useMemo(() => {
    return Object.keys(fetchList);
  }, []);
  const isKeyValuePromise = useMemo(() => {
    return fetchKey.every((key) => {
      return isPromise(fetchList[key]);
    });
  }, []);
  if (!isKeyValuePromise) {
    error('make sure each value of key of the first input is Promise');
  }

  const { initValue, onError, onSuccess, autoFetchMoment, closeLoading = false, deps = [] } = options;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(initValue || {});
  const render = useRef({ isFirstRender: true });
  const loadingFn = useCallback((isLoading) => {
    !closeLoading && setLoading(isLoading);
  }, []);

  const realDeps = autoFetchMoment === AutoFetchTimeType.MOUNT ? [] : deps;

  useEffect(() => {
    if (autoFetchMoment && autoFetchMoment === AutoFetchTimeType.UPDATE && render.current.isFirstRender) {
      render.current.isFirstRender = false;
      return;
    }

    const promiseList = fetchKey.map((key) => fetchList[key]);
    loadingFn(true);
    Promise.all(promiseList)
      .then((data: Array<any>) => {
        loadingFn(false);
        const result: Obj = {};
        data.forEach((item, index) => {
          const key = fetchKey[index];
          result[key] = item;
        });
        if (isFunction(onSuccess)) {
          onSuccess(result, setResponse);
        } else {
          setResponse(result);
        }
      })
      .catch((e) => {
        loadingFn(false);
        if (isFunction(onError)) {
          const data = onError(e);
          setResponse(data || response);
        } else {
          throw e;
        }
      });
  }, realDeps);

  return { response, loading };
}

// function useFetchAll(fetchList: FetchList, initValue?: Obj, deps: Array<any> = []): object {
//   if (!isObject(fetchList)) {
//     error('make sure the input is object');
//   }
//   if (initValue && isArray(initValue) && !deps) {
//     deps = initValue;
//     initValue = {};
//   }
//   if (!isArray(deps)) {
//     error('deps must be array');
//   }
//   const fetchKey = Object.keys(fetchList);
//   // todo: 可能存在执行多次fetchList里面每个key函数
//   const isKeyValuePromise = fetchKey.every((key) => {
//     return isPromise(fetchList[key]);
//   });
//   if (!isKeyValuePromise) {
//     error('make sure each value of key of the first input is Promise');
//   }
//   let realInitValue: Obj = useMemo(() => {
//     let target = {};
//     fetchKey.forEach((key: string) => {
//       // @ts-ignore
//       target[key] = initValue[key] ? initValue[key] : {};
//     });
//     return target
//   }, []);
//
//   const [data, renderData] = useState(realInitValue);
//   useEffect(() => {
//     const promiseList = fetchKey.map((key) => fetchList[key]);
//     Promise.all(promiseList)
//       .then((response: Array<any>) => {
//         const result: Obj = {};
//         response.forEach((data, index) => {
//           const key = fetchKey[index];
//           result[key] = data;
//         });
//         renderData(result);
//       })
//       .catch((e) => {
//         throw e;
//       });
//   }, deps);
//   return data;
// }

export default useFetchAll;
