"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the destroy of life cycle in react hook for functional component
 */
var react_1 = require("react");
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
function useDestroy(cb) {
    if (!lodash_1.isFunction(cb)) {
        log_1.error('cb must exist and must be a function in useDestroy');
    }
    react_1.useEffect(function () {
        return cb;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
exports.default = useDestroy;
