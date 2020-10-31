"use strict";
/**
 * @file get the status of life cycle for functional component
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
function useTrace() {
    var render = react_1.useRef({ status: 'mount', updateTimes: 0 });
    var fn = react_1.useCallback(function () {
        if (render.current.status === 'mount') {
            render.current.status = 'mounted';
        }
        else if (render.current.status === 'mounted') {
            render.current.status = 'update';
            render.current.updateTimes = 1;
        }
        else if (render.current.status === 'update') {
            render.current.updateTimes = render.current.updateTimes + 1;
        }
        return render.current;
    }, []);
    return fn();
}
exports.default = useTrace;
