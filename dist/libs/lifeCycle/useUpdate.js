"use strict";
/**
 * @file the update of life cycle in react hook for functional component
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lodash_1 = require("lodash");
var log_1 = require("../../utils/log");
function useUpdate(cb, deps, errorMsg) {
    var render = react_1.useRef({ isFirstRender: true });
    if (lodash_1.isArray(deps) && deps.length === 0) {
        log_1.error(errorMsg ||
            'deps can not be empty array in useUpdate! if you want to set deps empty, you can use another hook called useMount.');
    }
    react_1.useEffect(function () {
        if (render.current.isFirstRender) {
            render.current.isFirstRender = false;
        }
        else {
            return cb();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}
exports.default = useUpdate;
