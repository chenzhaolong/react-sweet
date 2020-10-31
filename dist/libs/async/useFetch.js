"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the ajax hook when user take action
 */
var react_1 = require("react");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
function useFetch(fetch, options) {
    if (options === void 0) { options = {}; }
    var _a = options.initValue, initValue = _a === void 0 ? {} : _a, path = options.path, onError = options.onError, onSuccess = options.onSuccess, _b = options.closeLoading, closeLoading = _b === void 0 ? false : _b, _c = options.deps, deps = _c === void 0 ? [] : _c;
    var _d = react_1.useState(initValue), response = _d[0], setResponse = _d[1];
    var _e = react_1.useState(false), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState(false), isError = _f[0], setError = _f[1];
    var startFetch = react_1.useCallback(function (params) {
        !closeLoading && setLoading(true);
        var promise = fetch(params);
        if (!tools_1.isPromise(promise)) {
            log_1.error('the first params of input must be return Promise.');
        }
        else {
            promise
                .then(function (response) {
                var data = path ? lodash_1.get(response, path) : response;
                !closeLoading && setLoading(false);
                setError(false);
                if (lodash_1.isFunction(onSuccess)) {
                    onSuccess(data, setResponse);
                }
                else {
                    setResponse(data);
                }
            })
                .catch(function (e) {
                !closeLoading && setLoading(false);
                setError(true);
                if (onError && lodash_1.isFunction(onError)) {
                    onError(e, setResponse);
                }
            });
        }
    }, deps);
    return { response: response, startFetch: startFetch, loading: loading, isError: isError };
}
exports.default = useFetch;
