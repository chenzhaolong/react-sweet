/**
 * @file store
 */
import { isFunction, isArray } from 'lodash';

type Reducer = (state: any, action: any) => object;

export class StoreUtils {
  static combineReducer(reducer: any): Reducer {
    const keys = Object.keys(reducer);

    return (state: any, action: any) => {
      const combineState = state;
      keys.forEach((key: string) => {
        const partState = state[key];
        const partReducer = reducer[key];
        if (isFunction(partReducer)) {
          const newState = partReducer(partState, action);
          if (newState) {
            combineState[key] = newState;
          }
        }
      });
      return combineState;
    };
  }

  static applyMiddleWares(plugins: any) {
    const middleWares: Array<Function> = [];
    if (isArray(plugins) && plugins.length > 0) {
      plugins.forEach((fn: any) => {
        if (isFunction(fn)) {
          middleWares.push(fn);
        }
      });
    }
    return middleWares;
  }

  static compose(middleWares: Array<Function>) {
    if (!isArray(middleWares)) {
      return (arg: any) => arg;
    }
    if (middleWares.length === 1) {
      return middleWares[0];
    }
    return middleWares.reduce((cur, next) => {
      return (...args: Array<any>) => cur(next(...args));
    });
  }
}
