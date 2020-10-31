"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file get the value by computed from the deps
 * @todo: useComputed中，现阶段依赖跟踪只会一层结构有效，如果追踪依赖是多层对象，就会有问题，后续版本修复
 */
var react_1 = require("react");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
function useComputed(computedObj) {
    if (!tools_1.isType('object', computedObj)) {
        log_1.error('the params of useComputed is wrong, make sure the params is object.');
    }
    // 计算属性的key
    var computedKeys = react_1.useMemo(function () {
        return Object.keys(computedObj);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 默认值
    var defaultValues = react_1.useMemo(function () {
        var values = {};
        computedKeys.forEach(function (key) {
            values[key] = computedObj[key].value();
        });
        return values;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // 默认的依赖
    var defaultDeps = react_1.useMemo(function () {
        var obj = {};
        computedKeys.forEach(function (key) {
            obj[key] = computedObj[key].deps ? lodash_1.cloneDeep(computedObj[key].deps) : {};
        });
        return obj;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var saveData = react_1.useRef(defaultValues);
    var saveDeps = react_1.useRef(defaultDeps);
    // 获取所有依赖属性
    var getDeps = react_1.useCallback(function (obj) {
        var depsObj = {};
        computedKeys.forEach(function (key) {
            var deps = obj[key].deps || {};
            Object.keys(deps).forEach(function (key1) {
                if (!depsObj[key1]) {
                    depsObj[key1] = deps[key1];
                }
            });
        });
        return depsObj;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var depsValues = getDeps(computedObj);
    var depsValuesArray = Object.keys(depsValues).map(function (key) { return depsValues[key]; });
    return react_1.useMemo(function () {
        var result = saveData.current;
        computedKeys.forEach(function (key) {
            var _a = computedObj[key], value = _a.value, _b = _a.deps, deps = _b === void 0 ? {} : _b;
            var isChange = !lodash_1.isEqual(saveDeps.current[key], deps);
            if (isChange) {
                saveDeps.current[key] = lodash_1.cloneDeep(deps);
                result[key] = value();
            }
        });
        saveData.current = result;
        return saveData.current;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, depsValuesArray);
}
exports.default = useComputed;
