/**
 * @file let the hook become promise
 */
import { useMemo, useState, useEffect } from 'react';
import { isPromise } from '../../utils/tools';
import { error } from '../../utils/log';

enum Status {
  Success = 'success',
  Fail = 'fail',
  Wait = 'wait'
}

interface Result {
  status: Status;
  data: any;
}

function usePromise(callback: any, deps?: Array<any>): Result {
  const [data, setData] = useState({ status: Status.Wait, data: {} });
  const realDeps = deps ? deps : [];
  useMemo(() => {
    const promise = callback();
    if (!isPromise(promise)) {
      error('the input params must be Promise, please make sure your input whether Promise is.');
      setData({ status: Status.Fail, data: {} });
    } else {
      promise
        .then((data: any) => {
          setData({
            status: Status.Success,
            data: data
          });
        })
        .catch((e: any) => {
          setData({
            status: Status.Fail,
            data: e
          });
        });
    }
  }, realDeps);
  return data;
}

export default usePromise;
