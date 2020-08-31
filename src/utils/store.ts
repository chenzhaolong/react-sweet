/**
 * @file store
 */
import { isFunction } from 'lodash';

type Reducer = (state: any, action: any) => object;

export class StoreUtils {
  static combineReducer(reducer: any): Reducer {
    const keys = Object.keys(reducer);

    return (state: any, action: any) => {
      const combineState = {};
      keys.forEach((key: string) => {
        const partState = state[key];
        const partReducer = reducer[key];
        if (isFunction(partReducer)) {
          combineState[key] = partReducer(partState, action);
        }
      });
      return combineState;
    };
  }
}
