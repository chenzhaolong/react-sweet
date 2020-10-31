"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file debounce and throttle for function
 */
var react_1 = require("react");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
function debounce(fn, delay) {
    var timeout;
    return function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        // @ts-ignore
        var context = this;
        var arg = rest;
        timeout = setTimeout(function () {
            fn.apply(context, arg);
        }, delay);
    };
}
function throttle(fn, threshold) {
    var start = new Date().getTime();
    var timeout;
    return function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        if (timeout) {
            clearTimeout(timeout);
        }
        var curTime = new Date().getTime();
        // @ts-ignore
        var context = this;
        var arg = rest;
        var diff = curTime - start;
        if (diff >= threshold) {
            fn.apply(context, arg);
        }
        else {
            timeout = setTimeout(function () {
                fn.apply(context, arg);
            }, threshold);
        }
        start = curTime;
    };
}
function checkOptions(options) {
    if (!options) {
        log_1.error('the second params of useFn must be exist!');
    }
    if (Object.keys(options).length === 0) {
        log_1.error('the second params of useFn can not be empty object!');
    }
    if (!tools_1.hasProperty(options, 'time')) {
        log_1.error('the second params of useFn must has the property of "time"!');
    }
}
function useFn(cb, options, deps) {
    checkOptions(options);
    var fn;
    if (options.type === 'throttle') {
        fn = throttle;
    }
    else {
        fn = debounce;
    }
    var realDeps = [options.time];
    if (deps && tools_1.isArray(deps) && deps.length > 0) {
        realDeps.concat(deps);
    }
    return react_1.useMemo(function () {
        return fn(cb, options.time);
    }, realDeps);
}
exports.default = useFn;
