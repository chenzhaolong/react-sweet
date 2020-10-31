"use strict";
/**
 * @file get the status of life cycle for functional component
 * todo:后续可以根据某些依赖来计算出他的update次数
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
function useTraces(trace, isHideInProd) {
    if (isHideInProd === void 0) { isHideInProd = false; }
    if (!lodash_1.isObject(trace)) {
        log_1.error('trace of input param must be Object type when use the hook of useTraces!');
    }
    var depsKey = Object.keys(trace);
    var defaultValue = react_1.useMemo(function () {
        return depsKey.map(function (key) {
            return {
                updateTimes: 0,
                dep: key,
                prevUpdateTime: '',
                currentUpdateTime: tools_1.formatDate(new Date()),
                currentValue: trace[key],
                prevValue: ''
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var render = react_1.useRef(defaultValue);
    var depsValue = depsKey.map(function (key) { return trace[key]; });
    return react_1.useMemo(function () {
        var traces = render.current;
        var result;
        // 生产环境下不追踪
        if (isHideInProd) {
            result = traces;
        }
        else {
            result = traces.map(function (item) {
                if (!lodash_1.isEqual(item.currentValue, trace[item.dep])) {
                    return {
                        dep: item.dep,
                        updateTimes: item.updateTimes + 1,
                        prevUpdateTime: item.currentUpdateTime,
                        currentUpdateTime: tools_1.formatDate(new Date()),
                        currentValue: trace[item.dep],
                        prevValue: item.currentValue
                    };
                }
                else {
                    return item;
                }
            });
        }
        render.current = result;
        return render.current;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, depsValue);
}
exports.default = useTraces;
