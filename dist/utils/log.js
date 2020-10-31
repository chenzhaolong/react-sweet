"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warning = exports.error = void 0;
/**
 * @file log
 */
var Colors = require('colors');
function error(msg) {
    var message = Colors.red(msg);
    throw new Error(message);
}
exports.error = error;
function warning(msg) {
    if (process.env.NODE_ENV === 'development') {
        var message = Colors.red(msg);
        console.warn("warning: " + message);
    }
}
exports.warning = warning;
