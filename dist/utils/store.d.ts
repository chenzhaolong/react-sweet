declare type Reducer = (state: any, action: any) => object;
export declare class StoreUtils {
  static combineReducer(reducer: any): Reducer;
  static applyMiddleWares(plugins: any): Function[];
  static compose(middleWares: Array<Function>): Function;
}
export {};
