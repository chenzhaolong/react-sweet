"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the title of document
 */
var react_1 = require("react");
function useTitle(title) {
    react_1.useEffect(function () {
        document.title = title;
    }, [title]);
}
exports.default = useTitle;
