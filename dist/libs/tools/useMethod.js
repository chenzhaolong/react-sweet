"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file input the data and optional function, it will return the
 * business function
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
function useMethod(initValue, fn, deps) {
    if (deps === void 0) { deps = []; }
    var _a = react_1.useState(initValue), value = _a[0], setRender = _a[1];
    if (!lodash_1.isFunction(fn)) {
        log_1.error('the second params of input must be the type of function');
    }
    var trigger = react_1.useMemo(function () {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            setRender(function (val) { return fn.apply(void 0, __spreadArrays([val], args)); });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return { value: value, trigger: trigger };
}
exports.default = useMethod;
