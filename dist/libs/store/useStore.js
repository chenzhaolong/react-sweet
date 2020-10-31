"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file store of state
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
var store_1 = require("../../utils/store");
var logPlugins_1 = require("../../plugins/logPlugins");
var cachePlugins_1 = require("../../plugins/cachePlugins");
function useStore(reducer, options) {
    if (options === void 0) { options = {}; }
    if (!lodash_1.isFunction(reducer) && !lodash_1.isObject(reducer)) {
        log_1.error('the reducer must be pure function or object in useStore');
    }
    var _a = options.openAsync, openAsync = _a === void 0 ? false : _a, _b = options.plugins, plugins = _b === void 0 ? [] : _b, _c = options.initState, initState = _c === void 0 ? {} : _c, _d = options.openCache, openCache = _d === void 0 ? false : _d, _e = options.openLog, openLog = _e === void 0 ? true : _e;
    // 合并reducer
    var combineReducer = react_1.useMemo(function () {
        return lodash_1.isObject(reducer) ? store_1.StoreUtils.combineReducer(reducer) : reducer;
    }, [reducer]);
    // 初始值
    var realInitState = react_1.useMemo(function () {
        if (lodash_1.isObject(reducer)) {
            Object.keys(reducer).forEach(function (key) {
                initState[key] = initState[key] ? initState[key] : {};
            });
        }
        return initState;
    }, []);
    var _f = react_1.useReducer(combineReducer, realInitState), state = _f[0], rootDispatch = _f[1];
    // 包装dispatch
    var wrapperDispatch = react_1.useCallback(function (state) {
        var middleWaresFn = store_1.StoreUtils.applyMiddleWares(plugins);
        if (openCache) {
            middleWaresFn.push(cachePlugins_1.cachePlugins);
        }
        if (openLog) {
            middleWaresFn.push(logPlugins_1.logPlugins);
        }
        var middleWares = middleWaresFn.map(function (fn) { return fn(state); });
        return store_1.StoreUtils.compose(middleWares)(rootDispatch);
    }, [plugins])(state);
    return {
        dispatch: function (action) {
            // @ts-ignore
            if (openAsync && lodash_1.isObject(action) && lodash_1.isFunction(action.payload)) {
                var payload = action.payload, type_1 = action.type;
                var realDispatch = function (data) {
                    wrapperDispatch({ type: type_1, payload: data });
                };
                return payload(state, realDispatch);
            }
            else {
                wrapperDispatch(action);
            }
        },
        getState: function (path, defaultValue) {
            if (lodash_1.isString(path)) {
                return lodash_1.get(state, path, defaultValue || {});
            }
            else {
                return state;
            }
        }
        // subscribe(fn: Function) {
        //   console.log(fn);
        // }
    };
}
exports.default = useStore;
