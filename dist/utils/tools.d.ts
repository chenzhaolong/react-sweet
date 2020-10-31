/**
 * @file tools for react-sweet
 */
/**
 * judge the target object has the property
 * @param target {Object} tested object
 * @param property {String} the property name
 * @param type {String} the type of property in the target object
 * @return {Boolean}
 */
export declare function hasProperty(target: object, property: string, type?: string): boolean;
/**
 * judge input is a Array
 * @param {any} array input
 * @return {boolean}
 */
export declare function isArray(array: any): boolean;
/**
 * judge the func has return
 * @param {Function} func function
 * @param {any} params the input of function
 * @return {boolean}
 */
export declare function hasReturnValue(func: (param?: any) => any, params: any): boolean;
/**
 * judge the type of value
 * @param {string} type
 * @param {any} value
 * @return boolean
 */
export declare function isType(type: string, value: any): boolean;
/**
 * get the type of value
 * @param {any} value
 * @return {string}
 */
export declare function getType(value: any): string;
/**
 * judge the fn is Promise
 * @param {any} fn
 * @return {boolean}
 */
export declare function isPromise(fn: any): boolean;
/**
 * get the rule of function
 * @param options
 */
export declare function getRuleFn(options: { rule: any; Rules: object; error: (msg: string) => any }): any;
/**
 * 格式化日期
 */
export declare function formatDate(date: Date): string;
