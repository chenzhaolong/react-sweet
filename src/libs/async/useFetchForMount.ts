/**
 * @file the fetch fo hook
 */
import { useEffect, useState } from 'react';
import { get } from 'lodash';
import { isPromise } from '../../utils/tools';
import { error } from '../../utils/log';

function useFetchForMount(fetch: any, path?: string, initValue?: any): any {
  const realInitValue = path ? initValue : '';
  const [response, setResponse] = useState(realInitValue);
  useEffect(() => {
    if (!isPromise(fetch)) {
      error('the input params must be Promise, please make sure your input whether Promise is.');
      return;
    }
    fetch
      .then((data: any) => {
        if (!data) {
          setResponse(realInitValue);
        }
        if (path) {
          const targetData = get(data, path, realInitValue);
          setResponse(targetData);
        } else {
          setResponse(data);
        }
      })
      .catch((e: any) => {
        if (process.env.NODE_ENV === 'development') {
          throw e;
        } else {
          setResponse(realInitValue);
        }
      });
  }, []);
  return response;
}

export default useFetchForMount;
