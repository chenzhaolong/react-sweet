"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the dynamic css style
 */
var react_1 = require("react");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
function handleByObject(originStyle, mapping) {
    var keys = Object.keys(mapping);
    var targetStyle = {};
    keys.forEach(function (key) {
        if (tools_1.hasProperty(originStyle, key) && mapping[key]) {
            targetStyle = originStyle[key];
        }
    });
    return targetStyle;
}
function useSwitch(style, condition, deps) {
    if (deps === void 0) { deps = []; }
    var saveStyle = react_1.useMemo(function () {
        if (condition && tools_1.isType('object', condition)) {
            return handleByObject(style, condition);
        }
        else if (condition && tools_1.isType('function', condition)) {
            var handleStyle = condition(style);
            if (handleStyle) {
                return handleStyle;
            }
            else {
                log_1.warning('if the second params is function, please make the function has return in the useStyle.');
                return {};
            }
        }
        else {
            log_1.error('the second params of useStyle must be object or function');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return saveStyle;
}
exports.default = useSwitch;
