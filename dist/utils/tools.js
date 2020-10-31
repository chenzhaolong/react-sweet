"use strict";
/**
 * @file tools for react-sweet
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.getRuleFn = exports.isPromise = exports.getType = exports.isType = exports.hasReturnValue = exports.isArray = exports.hasProperty = void 0;
/**
 * judge the target object has the property
 * @param target {Object} tested object
 * @param property {String} the property name
 * @param type {String} the type of property in the target object
 * @return {Boolean}
 */
function hasProperty(target, property, type) {
    if (typeof target !== 'object' || !property) {
        return false;
    }
    if (target.hasOwnProperty(property)) {
        if (type) {
            // @ts-ignore
            return typeof target[property] === type;
        }
        return true;
    }
    else {
        return false;
    }
}
exports.hasProperty = hasProperty;
/**
 * judge input is a Array
 * @param {any} array input
 * @return {boolean}
 */
function isArray(array) {
    if (Array.isArray && typeof Array.isArray === 'function') {
        return Array.isArray(array);
    }
    else {
        return Object.prototype.toString.call(array) === '[object Array]';
    }
}
exports.isArray = isArray;
/**
 * judge the func has return
 * @param {Function} func function
 * @param {any} params the input of function
 * @return {boolean}
 */
function hasReturnValue(func, params) {
    if (typeof func !== 'function') {
        return false;
    }
    var result = func(params);
    return result && true;
}
exports.hasReturnValue = hasReturnValue;
/**
 * judge the type of value
 * @param {string} type
 * @param {any} value
 * @return boolean
 */
function isType(type, value) {
    if (!type) {
        return false;
    }
    var targetType = '';
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
exports.isType = isType;
/**
 * get the type of value
 * @param {any} value
 * @return {string}
 */
function getType(value) {
    return Object.prototype.toString.call(value);
}
exports.getType = getType;
/**
 * judge the fn is Promise
 * @param {any} fn
 * @return {boolean}
 */
function isPromise(fn) {
    return fn.then && isType('function', fn.then);
}
exports.isPromise = isPromise;
/**
 * get the rule of function
 * @param options
 */
function getRuleFn(options) {
    var rule = options.rule, Rules = options.Rules, error = options.error;
    if (isType('function', rule)) {
        return rule;
    }
    else {
        var RulesKey = Object.keys(Rules);
        if (RulesKey.indexOf(rule) !== -1) {
            // @ts-ignore
            return Rules[rule];
        }
        if (!rule.test) {
            error('the rule must be function or special type or RegExp.');
        }
        else {
            return function (value) {
                return rule.test(value);
            };
        }
    }
}
exports.getRuleFn = getRuleFn;
/**
 * 格式化日期
 */
function formatDate(date) {
    return date.getHours() + "\u70B9" + date.getMinutes() + "\u5206" + date.getSeconds() + "\u79D2" + date.getUTCMilliseconds() + "\u6BEB\u79D2";
}
exports.formatDate = formatDate;
