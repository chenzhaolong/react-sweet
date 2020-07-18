/**
 * @file get the value by computed from the deps
 * @todo: useComputed中，现阶段依赖跟踪只会一层结构有效，如果追踪依赖是多层对象，救火有问题，后续版本修复
 */
import { useMemo, useRef, useCallback } from 'react';
import { isType } from '../../utils/tools';
import { error } from '../../utils/log';
import { isEqual } from 'lodash';

type SaveData = { current: { [key: string]: any } };

interface Computed {
  value: () => any;
  deps: object;
}

type ComputedObj = { [key: string]: Computed };

function useComputed(computedObj: ComputedObj): object {
  if (!isType('object', computedObj)) {
    error('the params of useComputed is wrong, make sure the params is object.');
  }

  // 计算属性的key
  const computedKeys = useMemo(() => {
    return Object.keys(computedObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 默认值
  const defaultValues = useMemo(() => {
    const values = {};
    computedKeys.forEach((key: string) => {
      values[key] = computedObj[key].value();
    });
    return values;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 默认的依赖
  const defaultDeps = useMemo(() => {
    const obj = {};
    computedKeys.forEach((key: string) => {
      obj[key] = computedObj[key].deps || {};
    });
    return obj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveData: SaveData = useRef(defaultValues);
  const saveDeps = useRef(defaultDeps);

  // 获取所有依赖属性
  const getDeps = useCallback((obj) => {
    const depsObj = {};
    computedKeys.forEach((key: string) => {
      const deps = obj[key].deps || {};
      Object.keys(deps).forEach((key1: string) => {
        if (!depsObj[key1]) {
          depsObj[key1] = deps[key1];
        }
      });
    });
    return depsObj;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const depsValues = getDeps(computedObj);
  const depsValuesArray = Object.keys(depsValues).map((key: string) => depsValues[key]);

  return useMemo(() => {
    const result = saveData.current;
    computedKeys.forEach((key: string) => {
      const { value, deps = {} } = computedObj[key];
      const isChange = !isEqual(saveDeps.current[key], deps);
      if (isChange) {
        saveDeps.current[key] = deps;
        result[key] = value();
      }
    });
    saveData.current = result;
    return saveData.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depsValuesArray);
}

export default useComputed;
