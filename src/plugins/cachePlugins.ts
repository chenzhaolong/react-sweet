/**
 * @file 缓存插件
 * 机制：缓存上一次同一个type的值，如果值一样，就不再dispatch
 */
import { isFunction, isString, isEqual } from 'lodash';

type Action = { type: string; payload: any };

type Dispatch = (action: Action) => any;

class Cache {
  static cacheData = {};

  static hasCache(type: string, cur: any) {
    if (!isString(type)) {
      return false;
    }
    if (Cache.cacheData[type]) {
      const prev = Cache.cacheData[type];
      if (isEqual(cur, prev)) {
        return true;
      } else {
        Cache.cacheData[type] = cur;
        return false;
      }
    } else {
      Cache.cacheData[type] = cur;
      return false;
    }
  }
}

export function cachePlugins(globalState: object) {
  return (next: Dispatch) => {
    return (action: Action) => {
      if (!isFunction(action) && !isFunction(action.payload)) {
        const { type, payload } = action;
        const hasCache = Cache.hasCache(type, payload);
        if (hasCache) {
          console.log(`%c${action.type}-has no change:`, 'color: blue', globalState);
        } else {
          next(action);
        }
      } else {
        next(action);
      }
    };
  };
}
