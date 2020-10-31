"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shadowEqual = void 0;
/**
 * @file the data structure for useState by input
 */
var react_1 = require("react");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
/**
 * 浅比较
 * @param obj1 {any} 对象
 * @param obj2 {any} 对象
 * @return {boolean} 返回值
 */
function shadowEqual(obj1, obj2) {
    var obj1Key = Object.keys(obj1);
    var obj2Key = Object.keys(obj2);
    if (obj1Key.length !== obj2Key.length) {
        return false;
    }
    return obj1Key.some(function (key) {
        if (obj2.hasOwnProperty(key)) {
            // @ts-ignore
            return obj1[key] !== obj2[key];
        }
        else {
            return true;
        }
    });
}
exports.shadowEqual = shadowEqual;
function different(oldValue, newValue) {
    var oldType = tools_1.getType(oldValue);
    var newType = tools_1.getType(newValue);
    if (oldType !== newType) {
        return true;
    }
    // add
    if (!oldValue) {
        return true;
    }
    // string
    if (tools_1.isType('string', oldValue)) {
        return oldValue !== newValue;
    }
    // array
    if (tools_1.isType('array', oldValue)) {
        return oldValue.length !== newValue.length;
    }
    // object
    if (tools_1.isType('object', oldValue)) {
        return shadowEqual(oldValue, newValue);
    }
    // default
    return true;
}
function useData(value) {
    if (!tools_1.isType('object', value)) {
        log_1.error('please check the type of input, the input of useData must be object type!');
    }
    var _a = react_1.useState(value), data = _a[0], setData = _a[1];
    var changeData = react_1.useCallback(function (source) {
        return function (path, newValue) {
            if (!tools_1.isType('string', path)) {
                log_1.error('the path in changeData must be string');
            }
            if (!path) {
                log_1.error('the path in changeData can not be undefined!');
            }
            var oldValue = lodash_1.get(source, path, '');
            if (different(oldValue, newValue)) {
                var targetValue = lodash_1.set(source, path, newValue);
                setData(lodash_1.cloneDeep(targetValue));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])(data);
    return { data: data, changeData: changeData };
}
exports.default = useData;
