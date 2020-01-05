/**
 * @file the ajax hook when user take action
 */
import { useState, useCallback } from 'react';
import { isPromise } from '../../../output/src/utils/tools';
import { error } from '../../utils/log';
import { get, isFunction } from 'lodash';

interface Result {
  result: any;
  start: (params: any) => any;
}

interface Options {
  initValue?: any;
  path?: string;
  onError?: (error: any) => any;
}

type Fetch = (params: any) => Promise<any>;

function useFetch(fetch: Fetch, options: Options): Result {
  const { initValue = {}, path, onError } = options;
  const [result, setResult] = useState(initValue);

  const start = useCallback((params: any) => {
    const promise = fetch(params);
    if (isPromise(promise)) {
      error('the first params of input must be return Promise.');
    } else {
      promise
        .then((response: any) => {
          const data = path ? get(response, path) : response;
          setResult(data);
        })
        .catch((e: any) => {
          if (onError && isFunction(onError)) {
            const data = onError(e);
            setResult(data || {});
          } else {
            throw e;
          }
        });
    }
  }, []);

  return { result, start };
}

export default useFetch;
