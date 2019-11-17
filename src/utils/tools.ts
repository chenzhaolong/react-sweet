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
export function hasProperty(target: object, property: string, type?: string): boolean {
  if (typeof target !== 'object' || !property) {
    return false;
  }
  if (target.hasOwnProperty(property)) {
    if (type) {
      // @ts-ignore
      return typeof target[property] === type;
    }
    return true;
  } else {
    return false;
  }
}

/**
 * judge input is a Array
 * @param {any} array input
 * @return {boolean}
 */
export function isArray(array: any): boolean {
  if (Array.isArray && typeof Array.isArray === 'function') {
    return Array.isArray(array);
  } else {
    return Object.prototype.toString.call(array) === '[object, Array]';
  }
}

/**
 * judge the func has return
 * @param {Function} func function
 * @param {any} params the input of function
 * @return {boolean}
 */
export function hasReturnValue(func: (param?: any) => any, params: any): boolean {
  if (typeof func !== 'function') {
    return false;
  }
  const result = func(params);
  return result && true;
}
