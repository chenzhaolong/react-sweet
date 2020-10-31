"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file render the list item
 * todo: 候选添加limit和limitRender等对渲染较多数据的性能进行优化
 */
var react_1 = require("react");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
function useFor(options) {
    if (!tools_1.hasProperty(options, 'render')) {
        log_1.error('the params of useFor must has the property of render');
    }
    if (!tools_1.hasProperty(options, 'source')) {
        log_1.error('the params of useFor must has the property of source');
    }
    if (!tools_1.isArray(options.source)) {
        log_1.error('the property of source in useFor must be Array');
    }
    var render = options.render, source = options.source;
    return react_1.useMemo(function () {
        return source.map(function (item, index) {
            return render(item, index);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [source]);
}
exports.default = useFor;
