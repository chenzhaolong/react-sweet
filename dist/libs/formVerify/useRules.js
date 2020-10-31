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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * the rules of form input
 * todo:后续支持外部注册规则表，然后直接在rule填写外部规则名
 */
var react_1 = require("react");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
var verifyRules_1 = __importDefault(require("../../utils/verifyRules"));
function useRules(options, deps) {
    if (deps === void 0) { deps = []; }
    if (!tools_1.isType('object', options)) {
        log_1.error('the options of input params must be object');
    }
    var _a = react_1.useMemo(function () {
        var targetKeys = Object.keys(options);
        var targetRules = {};
        var targetInitValues = {};
        var targetLogs = {};
        var targetCleanWhenError = {};
        targetKeys.forEach(function (key) {
            targetRules[key] = lodash_1.get(options, key + ".rule", '');
            targetInitValues[key] = lodash_1.get(options, key + ".initValue", '');
            targetLogs[key] = '';
            targetCleanWhenError[key] = lodash_1.get(options, key + ".isCleanWhenError", false);
        });
        return { targetRules: targetRules, targetInitValues: targetInitValues, targetLogs: targetLogs, targetKeys: targetKeys, targetCleanWhenError: targetCleanWhenError };
    }, deps), targetRules = _a.targetRules, targetInitValues = _a.targetInitValues, targetLogs = _a.targetLogs, targetKeys = _a.targetKeys, targetCleanWhenError = _a.targetCleanWhenError;
    var _b = react_1.useState(targetInitValues), values = _b[0], setValues = _b[1];
    var _c = react_1.useState(targetLogs), logs = _c[0], setLogs = _c[1];
    var _d = react_1.useState(false), result = _d[0], setResult = _d[1];
    var verifyRules = react_1.useMemo(function () {
        var fn = {};
        targetKeys.forEach(function (key) {
            fn[key] = tools_1.getRuleFn({
                rule: targetRules[key],
                Rules: verifyRules_1.default,
                error: log_1.error
            });
        });
        return fn;
    }, deps);
    var verify = react_1.useCallback(function (key, newValue, options1) {
        if (!tools_1.isType('string', key)) {
            log_1.error('key must be String type');
            return;
        }
        if (!tools_1.isType('function', verifyRules[key])) {
            log_1.error("the key " + key + " has no rule function, please make sure register the rule function");
        }
        // for number case
        var realVal = tools_1.isType('object', newValue) ? newValue.val : newValue;
        var effect = {};
        if (tools_1.isType('object', options1)) {
            // @ts-ignore
            effect = options1;
        }
        else if (tools_1.isType('function', options1)) {
            // @ts-ignore
            effect = { success: options1 };
        }
        var resForKey = verifyRules[key](newValue);
        var reaction = function (resForKey1, updateValues) {
            if (updateValues === void 0) { updateValues = true; }
            if (!lodash_1.isBoolean(resForKey1)) {
                log_1.error('the result after verify must be boolean when use useRules.');
            }
            var temp = values;
            var tempLogs = logs;
            tempLogs[key] = resForKey1;
            if (resForKey1) {
                effect.success && effect.success();
                temp[key] = realVal;
            }
            else {
                effect.fail && effect.fail();
                if (targetCleanWhenError[key]) {
                    updateValues = true;
                    temp[key] = '';
                }
                else {
                    temp[key] = realVal;
                }
            }
            var resForAllKey = targetKeys.every(function (key) { return tempLogs[key] && true; });
            setResult(resForAllKey);
            updateValues && setValues(__assign({}, temp));
            setLogs(__assign({}, tempLogs));
        };
        // 存在校验函数是异步
        if (tools_1.isPromise(resForKey)) {
            // 由于promise异步关系，先更新输入框，避免出现输入框卡顿现象。
            var temp = values;
            temp[key] = realVal;
            setValues(__assign({}, temp));
            return resForKey
                .then(function (d) {
                reaction(d, false);
                return d;
            })
                .catch(function () {
                reaction(false, false);
                return false;
            });
        }
        else {
            reaction(resForKey);
            return resForKey;
        }
    }, deps);
    return { values: values, verify: verify, logs: logs, result: result };
}
exports.default = useRules;
