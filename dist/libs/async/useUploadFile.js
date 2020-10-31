"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file upload the file
 * todo: 后续支持根据分片个数来划分文件体积，然后上传的能力
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var tools_1 = require("../../utils/tools");
var log_1 = require("../../utils/log");
var upload_1 = require("../../utils/upload");
var Status;
(function (Status) {
    Status["START"] = "start";
    Status["UPLOADING"] = "uploading";
    Status["SUCCESS"] = "success";
    Status["FAIL"] = "fail";
    Status["PAUSE"] = "pause";
    Status["TERMINATE"] = "terminate";
    Status["UNSTART"] = "unstart";
    Status["TIMEOUT"] = "timeout";
})(Status || (Status = {}));
function checkPromise(promise) {
    if (!tools_1.isPromise(promise)) {
        log_1.error('the first input params must be promise.');
    }
}
var defaultValue = function () { return ({ paramsList: [], time: 0, isPause: false, file: {}, startTime: 0 }); };
function useUploadFile(uploadFn, options) {
    upload_1.Upload.checkFn(uploadFn, options);
    var _a = options.openChunk, openChunk = _a === void 0 ? true : _a, limitChunkNumber = options.limitChunkNumber, limitFileSize = options.limitFileSize, chunkSize = options.chunkSize, interval = options.interval, 
    // threads,
    onSuccess = options.onSuccess, onError = options.onError, onPause = options.onPause, onTerminate = options.onTerminate, onProgress = options.onProgress, onTimeout = options.onTimeout, deps = options.deps, _b = options.useMd5, useMd5 = _b === void 0 ? false : _b, initValue = options.initValue, timeout = options.timeout;
    var _c = react_1.useState({ status: Status.UNSTART, data: initValue || {}, percentage: 0 }), response = _c[0], setResponse = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var realDeps = deps || [];
    var store = react_1.useRef(defaultValue());
    var handleSuccess = react_1.useCallback(function (data) {
        var setData = function (result) {
            setResponse({
                status: Status.SUCCESS,
                data: result,
                percentage: 100
            });
        };
        setLoading(false);
        store.current = defaultValue();
        if (lodash_1.isFunction(onSuccess)) {
            onSuccess(data, setData);
        }
        else {
            setData(data);
        }
    }, []);
    var handleError = react_1.useCallback(function (error, isWarn) {
        var setData = function (error) {
            setResponse({
                status: Status.FAIL,
                data: error,
                percentage: 0
            });
        };
        setLoading(false);
        store.current = defaultValue();
        if (isWarn) {
            return setData(error);
        }
        if (lodash_1.isFunction(onError)) {
            onError(error, setData);
        }
        else {
            throw error;
        }
    }, []);
    var handleTimeout = react_1.useCallback(function (data) {
        var setData = function (result) {
            setResponse({
                status: Status.TIMEOUT,
                data: result,
                percentage: 0
            });
        };
        log_1.warning('the upload is timeout, cause timeout maybe you invoke pause to stop stop and after a few second invoke resume for going on.');
        setLoading(false);
        store.current = defaultValue();
        if (lodash_1.isFunction(onTimeout)) {
            onTimeout(data, setData);
        }
        else {
            setData(data);
        }
    }, []);
    var upload = react_1.useCallback(function () {
        var _a = store.current, paramsList = _a.paramsList, time = _a.time, isPause = _a.isPause, file = _a.file, startTime = _a.startTime;
        if (paramsList.length === 0 || isPause) {
            setLoading(false);
            return;
        }
        var params = paramsList[time];
        var promise = uploadFn(params.chunk, params.content, params.md5, file, paramsList.length);
        checkPromise(promise);
        promise
            .then(function (data) {
            if (time === paramsList.length - 1) {
                handleSuccess(data);
            }
            else {
                // 终止或者暂停
                if (store.current.paramsList.length === 0 || store.current.isPause) {
                    setLoading(false);
                    return;
                }
                // 超时
                if (upload_1.Upload.checkUploadTimeOut(startTime, Date.now(), timeout)) {
                    handleTimeout(data);
                    return;
                }
                store.current.time = time + 1;
                setResponse({
                    status: Status.UPLOADING,
                    data: data,
                    percentage: Math.ceil((store.current.time / paramsList.length) * 100)
                });
                lodash_1.isFunction(onProgress) && onProgress(data);
                setTimeout(function () {
                    upload();
                }, interval || 0);
            }
        })
            .catch(function (e) {
            handleError(e);
        });
    }, realDeps);
    var start = react_1.useCallback(function (file) {
        if (!upload_1.Upload.checkFile(file)) {
            return;
        }
        if (upload_1.Upload.checkFileOverSize(file.size, limitFileSize)) {
            console.warn("upload stop, because the fileSize " + file.size + " is over the limitFileSize " + limitFileSize);
            return;
        }
        var chunkNumber = upload_1.Upload.getChunkNumber(file, chunkSize);
        setLoading(true);
        // 每次开始上传都要重置上次的残留数据
        setResponse({ status: Status.START, data: initValue || {}, percentage: 0 });
        upload_1.Upload.getMd5(file, useMd5)
            .then(function (md5Value) {
            if (openChunk && chunkNumber > 1) {
                if (upload_1.Upload.checkChunkOverNumber(chunkNumber, limitChunkNumber)) {
                    console.warn("upload stop, because the chunkNumber " + chunkNumber + " is over the limitChunkNumber " + limitChunkNumber);
                    return handleError(initValue || {}, true);
                }
                store.current = {
                    isPause: false,
                    paramsList: upload_1.Upload.getUploadParams(file, chunkNumber, chunkSize, md5Value),
                    time: 0,
                    file: file,
                    startTime: Date.now()
                };
                upload();
            }
            else {
                var promise = uploadFn(1, file, md5Value, file);
                checkPromise(promise);
                promise
                    .then(function (data) {
                    handleSuccess(data);
                })
                    .catch(function (e) {
                    handleError(e);
                });
            }
        })
            .catch(function (e) {
            handleError(e);
        });
    }, realDeps);
    var terminate = react_1.useCallback(function () {
        var setData = function (data) {
            setResponse({
                status: Status.TERMINATE,
                data: data,
                percentage: 0
            });
        };
        setLoading(false);
        store.current = defaultValue();
        if (lodash_1.isFunction(onTerminate)) {
            onTerminate(setData);
        }
        else {
            setData(initValue || {});
        }
    }, [response.percentage]);
    var pause = react_1.useCallback(function () {
        var setData = function (data) {
            setResponse({
                status: Status.PAUSE,
                data: data,
                percentage: response.percentage
            });
        };
        store.current.isPause = true;
        setLoading(false);
        if (lodash_1.isFunction(onPause)) {
            onPause(setData);
        }
        else {
            setData(response.data);
        }
    }, [response.percentage]);
    var resume = react_1.useCallback(function () {
        setLoading(true);
        store.current.isPause = false;
        upload();
    }, [response.percentage]);
    return { response: response, loading: loading, start: start, pause: pause, resume: resume, terminate: terminate };
}
exports.default = useUploadFile;
