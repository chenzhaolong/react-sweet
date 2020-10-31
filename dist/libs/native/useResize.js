"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file window resize hooks
 */
var react_1 = require("react");
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
function useResize(callback) {
    var resizeFn = react_1.useMemo(function () {
        return debounce(callback, 605);
    }, []);
    react_1.useEffect(function () {
        window.onresize = function (e) {
            resizeFn(e);
        };
        return function () {
            window.onresize = null;
        };
    }, []);
}
exports.default = useResize;
