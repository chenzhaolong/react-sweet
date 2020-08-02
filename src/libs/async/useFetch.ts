/**
 * @file the ajax hook when user take action
 */
import { useState, useCallback } from 'react';
import { isPromise } from '../../utils/tools';
import { error } from '../../utils/log';
import { get, isFunction } from 'lodash';

interface Result {
  response: any;
  startFetch: (params: any) => any;
  loading: boolean;
}

interface Options {
  initValue?: any;
  path?: string;
  onError?: (error: any) => void;
  onSuccess?: (data: any, setResponse: (data: any) => any) => void;
  closeLoading?: boolean;
}

type Fetch = (params: any) => Promise<any>;

function useFetch(fetch: Fetch, options: Options = {}): Result {
  const { initValue = {}, path, onError, onSuccess, closeLoading = false } = options;
  const [response, setResponse] = useState(initValue);
  const [loading, setLoading] = useState(false);

  const startFetch = useCallback((params: any) => {
    !closeLoading && setLoading(true);
    const promise = fetch(params);
    if (!isPromise(promise)) {
      error('the first params of input must be return Promise.');
    } else {
      promise
        .then((response: any) => {
          const data = path ? get(response, path) : response;
          !closeLoading && setLoading(false);
          if (isFunction(onSuccess)) {
            onSuccess(data, setResponse);
          } else {
            setResponse(data);
          }
        })
        .catch((e: any) => {
          !closeLoading && setLoading(false);
          if (onError && isFunction(onError)) {
            const data = onError(e);
            setResponse(data || {});
          } else {
            throw e;
          }
        });
    }
  }, []);

  return { response, startFetch, loading };
}

export default useFetch;
