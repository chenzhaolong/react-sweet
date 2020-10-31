"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upload = void 0;
/**
 * @file the utils of upload
 */
var ts_md5_1 = require("ts-md5");
var lodash_1 = require("lodash");
var log_1 = require("./log");
var tools_1 = require("./tools");
var Upload = /** @class */ (function () {
    function Upload() {
    }
    Upload.getMd5 = function (file, useMd5) {
        var fileReader = new FileReader();
        return new Promise(function (resolve, reject) {
            if (useMd5) {
                fileReader.readAsBinaryString(file);
                fileReader.onload = function () {
                    var md5 = new ts_md5_1.Md5();
                    // @ts-ignore
                    md5.appendStr(this.result);
                    var result = md5.end();
                    resolve(result);
                };
                fileReader.onerror = function (e) {
                    reject(e);
                };
            }
            else {
                resolve('');
            }
        });
    };
    Upload.checkFileOverSize = function (fileSize, limitFileSize) {
        if (lodash_1.isNumber(limitFileSize) && lodash_1.isNumber(fileSize)) {
            return fileSize > limitFileSize;
        }
        return false;
    };
    Upload.getChunkNumber = function (file, chunkSize) {
        return Math.ceil(file.size / chunkSize);
    };
    Upload.checkChunkOverNumber = function (chunkNumber, limitChunkNumber) {
        if (lodash_1.isNumber(chunkNumber) && lodash_1.isNumber(limitChunkNumber)) {
            return chunkNumber > limitChunkNumber;
        }
        return false;
    };
    Upload.computeChunkContent = function (file, baseSize, chunk) {
        var start = chunk * baseSize;
        var end = start + baseSize;
        if (end > file.size) {
            end = file.size;
        }
        return file.slice(start, end);
    };
    Upload.getUploadParams = function (file, chunkNumber, chunkSize, md5Value) {
        var paramsList = [];
        for (var i = 0; i < chunkNumber; i++) {
            paramsList.push({
                chunk: i,
                content: Upload.computeChunkContent(file, chunkSize, i),
                md5: md5Value
            });
        }
        return paramsList;
    };
    Upload.checkFile = function (file) {
        if (!file) {
            log_1.warning('file is undefined when get start in the useUploadFile.');
            return false;
        }
        if (!(file instanceof File)) {
            log_1.warning('file is not the instance of File.');
            return false;
        }
        if (!file.size) {
            log_1.warning('file has no size when get start in the useUpLoadFile.');
            return false;
        }
        return true;
    };
    Upload.checkFn = function (uploadFn, options) {
        if (!lodash_1.isFunction(uploadFn)) {
            log_1.error('the first params must be function in useUploadFile.');
        }
        if (!lodash_1.isObject(options)) {
            log_1.error('the second params must be object in useUploadFile.');
        }
        else {
            if (!tools_1.hasProperty(options, 'chunkSize', 'number')) {
                log_1.error('the chunkSize of options must exist and must be number in useUploadFile.');
            }
        }
    };
    Upload.checkUploadTimeOut = function (startTime, endTime, timeout) {
        if (lodash_1.isNumber(timeout)) {
            return endTime - startTime > timeout;
        }
        return false;
    };
    return Upload;
}());
exports.Upload = Upload;
