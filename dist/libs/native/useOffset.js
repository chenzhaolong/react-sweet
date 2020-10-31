"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the performance of function component when rendering
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
function useOffset(deps) {
    var element = react_1.useRef({});
    var _a = react_1.useState({}), offset = _a[0], setOffset = _a[1];
    var realDeps = deps ? deps : [];
    react_1.useEffect(function () {
        var newOffset = {
            offsetTop: lodash_1.get(element, 'current.offsetTop', 0),
            offsetLeft: lodash_1.get(element, 'current.offsetLeft', 0),
            offsetWidth: lodash_1.get(element, 'current.offsetWidth', 0),
            offsetHeight: lodash_1.get(element, 'current.offsetHeight', 0)
        };
        setOffset(newOffset);
    }, realDeps);
    return { element: element, offset: offset };
}
exports.default = useOffset;
