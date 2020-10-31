"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file let the hook become promise
 */
var react_1 = require("react");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var Status;
(function (Status) {
    Status["Success"] = "success";
    Status["Fail"] = "fail";
    Status["Wait"] = "wait";
})(Status || (Status = {}));
function useAwait(callback, deps) {
    var _a = react_1.useState({ status: Status.Wait, data: {}, error: '' }), data = _a[0], setData = _a[1];
    var realDeps = deps ? deps : [];
    react_1.useMemo(function () {
        setData({
            status: Status.Wait,
            data: data.data,
            error: ''
        });
        var promise = callback();
        if (!promise || !tools_1.isPromise(promise)) {
            log_1.error('the input params must be Promise, please make sure your input whether Promise is.');
        }
        else {
            promise
                .then(function (result) {
                setData({
                    status: Status.Success,
                    data: result,
                    error: ''
                });
            })
                .catch(function (e) {
                setData({
                    status: Status.Fail,
                    data: data.data,
                    error: e
                });
            });
        }
    }, realDeps);
    return data;
}
exports.default = useAwait;
