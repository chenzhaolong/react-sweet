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
 * @file store of connection
 */
var ProviderRepo_1 = require("../../utils/ProviderRepo");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
var react_1 = require("react");
function useConnect(options) {
    var relateKey = options.relateKey, mapDispatch = options.mapDispatch, mapState = options.mapState, _a = options.deps, deps = _a === void 0 ? [] : _a;
    if (!lodash_1.isString(relateKey)) {
        log_1.error('the relateKey must exist when invoke useConnect.');
    }
    var Context = react_1.useMemo(function () {
        return ProviderRepo_1.ProviderRepo.getFromRepo(relateKey);
    }, [relateKey]);
    if (!Context) {
        // @ts-ignore
        log_1.error("the key of " + relateKey + " has nothing, please make sure the key has Context Component.");
    }
    var store = react_1.useContext(Context);
    var partState = react_1.useMemo(function () {
        if (lodash_1.isFunction(mapState)) {
            return mapState(store.getState);
        }
        return store.getState();
    }, __spreadArrays([store], deps));
    var partDispatch = react_1.useMemo(function () {
        var dispatchFn = {};
        if (lodash_1.isFunction(mapDispatch)) {
            var dispatch = store.dispatch, getState = store.getState;
            var globalState = getState();
            dispatchFn = mapDispatch(globalState, dispatch);
        }
        return function (key) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            var fn = dispatchFn[key];
            if (lodash_1.isFunction(fn)) {
                return fn.apply(void 0, rest);
            }
            else {
                log_1.warning("the dispatch function \"" + key + "\" has not existed in the mpaDispatch in useConnect. please check it.");
            }
        };
    }, __spreadArrays([store], deps));
    return {
        state: partState,
        dispatch: partDispatch,
        Consumer: Context.Consumer
    };
}
exports.default = useConnect;
