"use strict";
/**
 * @file the mount of life cycle in react hook for functional component
 */
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var log_1 = require("../../utils/log");
var tools_1 = require("../../utils/tools");
function useMount(cb) {
    react_1.useEffect(function () {
        if (typeof cb === 'function') {
            return cb();
        }
        else {
            if (tools_1.hasProperty(cb, 'mount', 'function')) {
                var mount = cb['mount'];
                mount();
                if (tools_1.hasProperty(cb, 'clean', 'function')) {
                    var clean = cb['clean'];
                    return clean;
                }
                return function () { };
            }
            else {
                log_1.error('options of useMount must has property of mount!');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
exports.default = useMount;
