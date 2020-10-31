"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * the rule of form input for single rule
 * todo: 后续的版本可以考虑将校验和组件组合在一起，成为校验型高阶组件
 */
var react_1 = require("react");
var verifyRules_1 = __importDefault(require("../../utils/verifyRules"));
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
function useRule(rule, initValue, isCleanWhenError, deps) {
    if (isCleanWhenError === void 0) { isCleanWhenError = false; }
    if (deps === void 0) { deps = []; }
    var _a = react_1.useState(initValue || ''), value = _a[0], setValue = _a[1];
    var _b = react_1.useState(''), isPass = _b[0], setPass = _b[1];
    var verifyRule = react_1.useMemo(function () {
        return tools_1.getRuleFn({ rule: rule, Rules: verifyRules_1.default, error: log_1.error });
    }, deps);
    var verify = react_1.useCallback(function (newValue, options) {
        var effect = {};
        if (tools_1.isType('object', options)) {
            effect = options;
        }
        else if (tools_1.isType('function', options)) {
            effect = { success: options };
        }
        // for number case
        var realVal = tools_1.isType('object', newValue) ? newValue.val : newValue;
        var reaction = function (result, updateValues) {
            if (updateValues === void 0) { updateValues = true; }
            if (lodash_1.isBoolean(result)) {
                if (result) {
                    effect.success && effect.success();
                    updateValues && setValue(realVal);
                    // @ts-ignore
                    setPass(true);
                }
                else {
                    effect.fail && effect.fail();
                    // @ts-ignore
                    setPass(false);
                    if (isCleanWhenError) {
                        setValue('');
                    }
                    else {
                        updateValues && setValue(realVal);
                    }
                }
            }
            else {
                log_1.error('the result after verify must be boolean when use useRule.');
            }
        };
        var result = verifyRule(newValue);
        // 存在校验函数是异步
        if (tools_1.isPromise(result)) {
            // 由于promise异步关系，先更新输入框，避免出现输入框卡顿现象。
            setValue(realVal);
            return result
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
            reaction(result);
            return result;
        }
    }, deps);
    return { value: value, verify: verify, isPass: isPass };
}
exports.default = useRule;
