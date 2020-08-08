/**
 * @file fetch all api
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { isFunction } from 'lodash';
import { error } from '../../utils/log';
import { isPromise } from '../../utils/tools';

type FetchList = () => Promise<any>;

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
  autoFetchMoment?: AutoFetchTimeType;
}

interface Result {
  readonly response?: object;
  loading?: boolean;
}

function useAutoFetch(fetchList: FetchList, options: Options): Result {
  if (!isFunction(fetchList)) {
    error('make sure the input is function');
  }

  const {
    initValue,
    onError,
    onSuccess,
    autoFetchMoment = AutoFetchTimeType.MOUNT,
    closeLoading = false,
    deps = []
  } = options;
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(initValue || {});
  const render = useRef({ isFirstRender: true });
  const loadingFn = useCallback((isLoading) => {
    !closeLoading && setLoading(isLoading);
  }, []);

  const realDeps = autoFetchMoment === AutoFetchTimeType.MOUNT ? [] : deps;

  useEffect(() => {
    // 如果是update，则首次不fetch
    if (autoFetchMoment && autoFetchMoment === AutoFetchTimeType.UPDATE && render.current.isFirstRender) {
      render.current.isFirstRender = false;
      return;
    }
    const promiseFn: Promise<any> = fetchList();
    if (!isPromise(promiseFn)) {
      error('make sure the first input function returned is promise.');
    }
    loadingFn(true);
    promiseFn
      .then((data: Array<any>) => {
        loadingFn(false);
        if (isFunction(onSuccess)) {
          onSuccess(data, setResponse);
        } else {
          setResponse(data);
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

export default useAutoFetch;
