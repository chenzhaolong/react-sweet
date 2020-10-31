/**
 * @file let the hook become promise
 */
import { useMemo, useState } from 'react';
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
  error: any;
}

function useAwait(callback: any, deps?: Array<any>): Result {
  const [data, setData] = useState({ status: Status.Wait, data: {}, error: '' });
  const realDeps = deps ? deps : [];
  useMemo(() => {
    setData({
      status: Status.Wait,
      data: data.data,
      error: ''
    });
    const promise = callback();
    if (!promise || !isPromise(promise)) {
      error('the input params must be Promise, please make sure your input whether Promise is.');
    } else {
      promise
        .then((result: any) => {
          setData({
            status: Status.Success,
            data: result,
            error: ''
          });
        })
        .catch((e: any) => {
          setData({
            status: Status.Fail,
            data: data.data,
            error: e
          });
        });
    }
  }, realDeps);
  return data;
}

export default useAwait;
