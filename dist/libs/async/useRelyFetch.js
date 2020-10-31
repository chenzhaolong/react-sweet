"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the fetch base on the dependent relationship between two api
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
function useRelyFetch(options) {
    var main = options.main, rely = options.rely, _a = options.initValue, initValue = _a === void 0 ? {} : _a, paramsFn = options.paramsFn, onSuccess = options.onSuccess, onError = options.onError, _b = options.closeLoading, closeLoading = _b === void 0 ? false : _b, deps = options.deps;
    if (!lodash_1.isFunction(main)) {
        log_1.error('the main of options must be exist and be Promise type.');
    }
    if (!lodash_1.isFunction(rely)) {
        log_1.error('the rely of options must be exist and be Promise type.');
    }
    if (initValue) {
        if (!lodash_1.isObject(initValue)) {
            log_1.error('the initValue of options must object type.');
        }
        if (!tools_1.hasProperty(initValue, 'mainData')) {
            log_1.error('the mainData of initValue must exist.');
        }
        if (!tools_1.hasProperty(initValue, 'relyData')) {
            log_1.error('the relyData of initValue must exist.');
        }
    }
    var realDeps = lodash_1.isArray(deps) ? deps : [];
    var _c = react_1.useState(initValue || { mainData: {}, relyData: {} }), response = _c[0], setResponse = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(false), isError = _e[0], setError = _e[1];
    var loadFn = react_1.useCallback(function (status) {
        !closeLoading && setLoading(status);
    }, []);
    var start = react_1.useCallback(function (params) {
        var setData = function (mainData, relyData) {
            setResponse({ mainData: mainData || {}, relyData: relyData || {} });
        };
        setLoading(true);
        var mainPromise = main(params.mainParams);
        if (!tools_1.isPromise(mainPromise)) {
            setLoading(false);
            log_1.error('the options of main must be Promise for return');
        }
        mainPromise
            .then(function (mainData) {
            var realPath = lodash_1.isFunction(paramsFn)
                ? paramsFn({ mainData: mainData, relyParams: params.relyParams })
                : { mainData: mainData, relyParams: params.relyParams };
            var relyPromise = rely(realPath);
            if (!tools_1.isPromise(relyPromise)) {
                setLoading(false);
                log_1.error('the options of rely must be Promise for return');
            }
            relyPromise
                .then(function (relyData) {
                loadFn(false);
                setError(false);
                if (lodash_1.isFunction(onSuccess)) {
                    onSuccess({ relyData: relyData, mainData: mainData }, setData);
                }
                else {
                    setResponse({ relyData: relyData, mainData: mainData });
                }
            })
                .catch(function (error) {
                loadFn(false);
                setError(true);
                lodash_1.isFunction(onError) && onError(error, 'rely', setData);
            });
        })
            .catch(function (error) {
            loadFn(false);
            setError(true);
            lodash_1.isFunction(onError) && onError(error, 'main', setData);
        });
    }, realDeps);
    return { response: response, start: start, loading: loading, isError: isError };
}
exports.default = useRelyFetch;
