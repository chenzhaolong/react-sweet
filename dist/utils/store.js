"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreUtils = void 0;
/**
 * @file store
 */
var lodash_1 = require("lodash");
var StoreUtils = /** @class */ (function () {
    function StoreUtils() {
    }
    StoreUtils.combineReducer = function (reducer) {
        var keys = Object.keys(reducer);
        return function (state, action) {
            var combineState = state;
            keys.forEach(function (key) {
                var partState = state[key];
                var partReducer = reducer[key];
                if (lodash_1.isFunction(partReducer)) {
                    var newState = partReducer(partState, action);
                    if (newState) {
                        combineState[key] = newState;
                    }
                }
            });
            return __assign({}, combineState);
        };
    };
    StoreUtils.applyMiddleWares = function (plugins) {
        var middleWares = [];
        if (lodash_1.isArray(plugins) && plugins.length > 0) {
            plugins.forEach(function (fn) {
                if (lodash_1.isFunction(fn)) {
                    middleWares.push(fn);
                }
            });
        }
        return middleWares;
    };
    StoreUtils.compose = function (middleWares) {
        if (!lodash_1.isArray(middleWares)) {
            return function (arg) { return arg; };
        }
        if (middleWares.length === 1) {
            return middleWares[0];
        }
        return middleWares.reduce(function (cur, next) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return cur(next.apply(void 0, args));
            };
        });
    };
    return StoreUtils;
}());
exports.StoreUtils = StoreUtils;
