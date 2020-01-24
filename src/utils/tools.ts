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
    return Object.prototype.toString.call(array) === '[object Array]';
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

/**
 * judge the type of value
 * @param {string} type
 * @param {any} value
 * @return boolean
 */
export function isType(type: string, value: any): boolean {
  if (!type) {
    return false;
  }
  let targetType = '';
  switch (type) {
    case 'object':
      targetType = '[object Object]';
      break;
    case 'array':
      targetType = '[object Array]';
      break;
    case 'boolean':
      targetType = '[object Boolean]';
      break;
    case 'string':
      targetType = '[object String]';
      break;
    case 'function':
      targetType = '[object Function]';
      break;
    default:
      targetType = '[object undefined]';
      break;
  }
  return Object.prototype.toString.call(value) === targetType;
}

/**
 * get the type of value
 * @param {any} value
 * @return {string}
 */
export function getType(value: any) {
  return Object.prototype.toString.call(value);
}

/**
 * judge the fn is Promise
 * @param {any} fn
 * @return {boolean}
 */
export function isPromise(fn: any): boolean {
  return fn.then && isType('function', fn.then);
}

/**
 * get the rule of function
 * @param options
 */
export function getRuleFn(options: { rule: any; Rules: object; error: (msg: string) => any }) {
  const { rule, Rules, error } = options;
  if (isType('function', rule)) {
    return rule;
  } else {
    const RulesKey = Object.keys(Rules);
    if (RulesKey.indexOf(rule) !== -1) {
      // @ts-ignore
      return Rules[rule];
    }
    if (!rule.test) {
      error('the rule must be function or special type or RegExp.');
    } else {
      return (value: any) => {
        return rule.test(value);
      };
    }
  }
}
