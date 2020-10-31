"use strict";
/**
 * @file serialize the useUpdate
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../index");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var errorMsg = 'deps can not be empty array in useUpdates! please make sure your deps.';
function useUpdates(options) {
    if (tools_1.isArray(options)) {
        // @ts-ignore
        options.forEach(function (item) {
            /* eslint-disable react-hooks/rules-of-hooks */
            index_1.useUpdate(item.update, item.deps, errorMsg);
        });
    }
    else if (typeof options === 'object') {
        log_1.error('the input is object, maybe you can use the hook of useUpdate');
    }
    else {
        log_1.error('the input in useUpdates must be array');
    }
}
exports.default = useUpdates;
