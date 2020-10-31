"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the fetch for hook
 * @deprecated 暂时废除
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
function useFetchForMount(fetch, path, initValue) {
    if (path && !initValue) {
        log_1.error('if the second input exist, the third input must be exist.');
        return;
    }
    var realInitValue = path ? initValue : {};
    var _a = react_1.useState(realInitValue), response = _a[0], setResponse = _a[1];
    react_1.useEffect(function () {
        var promise = fetch();
        if (!tools_1.isPromise(promise)) {
            log_1.error('the input params must be Promise, please make sure your input whether Promise is.');
            return;
        }
        promise
            .then(function (data) {
            if (!data) {
                setResponse(realInitValue);
            }
            if (path) {
                var targetData = lodash_1.get(data, path, realInitValue);
                setResponse(targetData);
            }
            else {
                setResponse(data);
            }
        })
            .catch(function (e) {
            if (process.env.NODE_ENV === 'development') {
                throw e;
            }
            else {
                setResponse(realInitValue);
            }
        });
    }, []);
    return response;
}
exports.default = useFetchForMount;
