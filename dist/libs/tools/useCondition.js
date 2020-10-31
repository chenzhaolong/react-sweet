"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the ref of component
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
function useCondition(options, deps) {
    return react_1.useMemo(function () {
        var yes = options.yes, no = options.no, condition = options.condition;
        var result = typeof condition === 'function' ? condition() : condition;
        if (!lodash_1.isBoolean(result)) {
            log_1.warning('condition must return boolean in useCondition.');
            return '';
        }
        if (result) {
            return typeof yes === 'function' ? yes() : yes;
        }
        else {
            return typeof no === 'function' ? no() : no;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
exports.default = useCondition;
