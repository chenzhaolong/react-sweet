/**
 * @file get the value by computed from the deps
 * @todo: 重写useComputed
 */
import { useMemo, useRef, useCallback } from 'react';
import { isArray, omit } from '../../utils/tools';
import { error, warning } from '../../utils/log';

type Value = { [index: string]: any };

type Target = { deps?: Array<any>; [index: string]: any };

type SaveData = { current: { [key: string]: any } };

// function handleKV(target: Target): object {
//   const deps = target.deps || [];
//   const keys = Object.keys(target).filter((key) => key !== 'deps');
//   return useMemo(() => {
//     const value: Value = {};
//     keys.forEach((key) => {
//       value[key] = target[key]();
//     });
//     return value;
//   }, deps);
// }

function useComputed(array: any): object {
  if (!isArray(array)) {
    error('the params of useComputed is wrong, make sure the params is array.');
  }

  const properties = useMemo(() => {
    const target = {};
    array.forEach((item: object) => {
      const keys = Object.keys(item).omit();
    });
  }, []);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const saveData: SaveData = useRef({});
  const fn = useCallback(() => {});

  // array.forEach((item: { deps?: Array<any> }) => {
  //   const temResult: Value = handleKV(item);
  //   const keys = Object.keys(temResult);
  //   keys.forEach((key) => {
  //     saveData.current[key] = temResult[key];
  //   });
  // });
  return saveData.current;
}

export default useComputed;
