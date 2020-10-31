"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the polling fetch of react hook
 * fit to the params of callback is not changed;
 * todo：后续支持暂时停止，然后恢复轮询
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
function usePolling(callback, options) {
    var _a = options.intervalTime, intervalTime = _a === void 0 ? 0 : _a, terminate = options.terminate, _b = options.initValue, initValue = _b === void 0 ? {} : _b, _c = options.closeLoading, closeLoading = _c === void 0 ? false : _c, limitPollingNumber = options.limitPollingNumber, limitPollingTime = options.limitPollingTime, onError = options.onError, onSuccess = options.onSuccess, onCompleteByLimitNumber = options.onCompleteByLimitNumber, onCompleteByLimitTime = options.onCompleteByLimitTime, onReset = options.onReset, _d = options.deps, deps = _d === void 0 ? [] : _d;
    if (!lodash_1.isFunction(terminate)) {
        log_1.error('the terminate of options must be exist.');
    }
    if (!lodash_1.isNumber(intervalTime)) {
        log_1.error('the intervalTime of options must be exist.');
    }
    if (!lodash_1.isFunction(callback)) {
        log_1.error('the first params of input must be function type.');
    }
    var _e = react_1.useState(initValue || {}), response = _e[0], setResponse = _e[1];
    var _f = react_1.useState(false), loading = _f[0], setLoading = _f[1];
    var _g = react_1.useState(false), isError = _g[0], setError = _g[1];
    var pollingInfo = react_1.useRef({ number: 0, currentTime: 0, isStop: false, timer: null, destroy: false });
    var clearTimer = react_1.useCallback(function (timer, isError) {
        if (isError === void 0) { isError = false; }
        setLoading(false);
        setError(isError);
        // @ts-ignore
        timer && clearTimeout(timer);
        pollingInfo.current.timer = null;
        pollingInfo.current.number = 0;
        pollingInfo.current.currentTime = 0;
    }, []);
    var start = react_1.useCallback(function (params) {
        // 限制轮询次数
        if (lodash_1.isNumber(limitPollingNumber) && pollingInfo.current.number >= limitPollingNumber) {
            if (lodash_1.isFunction(onCompleteByLimitNumber)) {
                onCompleteByLimitNumber(setResponse);
            }
            else {
                setResponse(initValue);
            }
            return clearTimer(pollingInfo.current.timer);
        }
        // 限制轮询时间
        if (lodash_1.isNumber(limitPollingTime) &&
            pollingInfo.current.currentTime > 0 &&
            Date.now() - pollingInfo.current.currentTime > limitPollingTime) {
            if (lodash_1.isFunction(onCompleteByLimitTime)) {
                onCompleteByLimitTime(setResponse);
            }
            else {
                setResponse(initValue);
            }
            return clearTimer(pollingInfo.current.timer);
        }
        !closeLoading && setLoading(true);
        pollingInfo.current.number += 1;
        // 第一次轮询
        if (pollingInfo.current.number === 1) {
            pollingInfo.current.currentTime = Date.now();
            pollingInfo.current.isStop = false;
        }
        var promise = callback(params);
        if (!tools_1.isPromise(promise)) {
            log_1.error('the first params of input must be Promise.');
        }
        else {
            promise
                .then(function (response) {
                var isNotPolling = terminate(response);
                if (!lodash_1.isBoolean(isNotPolling)) {
                    log_1.error('the return of terminate must be Boolean type.');
                }
                if (isNotPolling) {
                    if (lodash_1.isFunction(onSuccess)) {
                        onSuccess(response, setResponse);
                    }
                    else {
                        setResponse(response);
                    }
                    clearTimer(pollingInfo.current.timer);
                }
                else {
                    // 处理临界点：当触发reset时，正好发起了一条异步，此时要做拦截
                    if (pollingInfo.current.isStop) {
                        return !pollingInfo.current.destroy && clearTimer(pollingInfo.current.timer);
                    }
                    // @ts-ignore
                    pollingInfo.current.timer = setTimeout(function () {
                        start(params);
                    }, intervalTime);
                }
            })
                .catch(function (e) {
                clearTimer(pollingInfo.current.timer, true);
                if (onError && lodash_1.isFunction(onError)) {
                    onError(e, setResponse);
                }
            });
        }
    }, deps);
    var reset = react_1.useCallback(function (initData) {
        pollingInfo.current.isStop = true;
        clearTimer(pollingInfo.current.timer);
        if (lodash_1.isFunction(onReset)) {
            onReset(setResponse);
        }
        else {
            var data = initData ? initData : initValue;
            setResponse(data);
        }
    }, []);
    // 销毁时清除定时器
    react_1.useEffect(function () {
        return function () {
            pollingInfo.current.isStop = true;
            // 防止在销毁组件时还存在一条异步请求，执行state更新
            pollingInfo.current.destroy = true;
            clearTimer(pollingInfo.current.timer);
        };
    }, []);
    return { response: response, start: start, reset: reset, loading: loading, isError: isError };
}
exports.default = usePolling;
