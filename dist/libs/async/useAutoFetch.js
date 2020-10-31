"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file fetch all api
 * todo: 在update的时候添加按条件执行
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
var AutoFetchTimeType;
(function (AutoFetchTimeType) {
    AutoFetchTimeType["MOUNT"] = "mount";
    AutoFetchTimeType["UPDATE"] = "update";
})(AutoFetchTimeType || (AutoFetchTimeType = {}));
function useAutoFetch(fetchList, options) {
    if (!lodash_1.isFunction(fetchList)) {
        log_1.error('make sure the input is function');
    }
    var initValue = options.initValue, onError = options.onError, onSuccess = options.onSuccess, _a = options.autoFetchMoment, autoFetchMoment = _a === void 0 ? AutoFetchTimeType.MOUNT : _a, _b = options.closeLoading, closeLoading = _b === void 0 ? false : _b, _c = options.updateDeps, updateDeps = _c === void 0 ? [] : _c;
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(initValue || {}), response = _e[0], setResponse = _e[1];
    var _f = react_1.useState(false), isError = _f[0], setError = _f[1];
    var render = react_1.useRef({ isFirstRender: true });
    var loadingFn = react_1.useCallback(function (isLoading) {
        !closeLoading && setLoading(isLoading);
    }, []);
    var realDeps = autoFetchMoment === AutoFetchTimeType.MOUNT ? [] : updateDeps;
    react_1.useEffect(function () {
        // 如果是update，则首次不fetch
        if (autoFetchMoment && autoFetchMoment === AutoFetchTimeType.UPDATE && render.current.isFirstRender) {
            render.current.isFirstRender = false;
            return;
        }
        var promiseFn = fetchList();
        if (!tools_1.isPromise(promiseFn)) {
            log_1.error('make sure the first input function returned is promise.');
        }
        loadingFn(true);
        promiseFn
            .then(function (data) {
            loadingFn(false);
            setError(false);
            if (lodash_1.isFunction(onSuccess)) {
                onSuccess(data, setResponse);
            }
            else {
                setResponse(data);
            }
        })
            .catch(function (e) {
            loadingFn(false);
            setError(true);
            if (onError && lodash_1.isFunction(onError)) {
                onError(e, setResponse);
            }
        });
    }, realDeps);
    return { response: response, loading: loading, isError: isError };
}
exports.default = useAutoFetch;
