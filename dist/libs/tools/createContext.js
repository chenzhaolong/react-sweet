"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file the context of react hook
 */
var react_1 = require("react");
var lodash_1 = require("lodash");
var tools_1 = require("../../utils/tools");
var ContextEvent = /** @class */ (function () {
    function ContextEvent() {
        this.events = {};
        this.tempZone = {}; // temporary data for invoke the listener function
    }
    ContextEvent.prototype.publish = function (name, data) {
        var eventNames = Object.keys(this.events);
        if (eventNames.indexOf(name) !== -1 && this.events[name].length > 0) {
            this.events[name].forEach(function (fn) {
                lodash_1.isFunction(fn) && fn(data);
            });
        }
        else {
            this.tempZone[name] = data;
        }
    };
    ContextEvent.prototype.listener = function (name, cb) {
        if (tools_1.hasProperty(this.tempZone, name)) {
            cb(this.tempZone[name]);
            delete this.tempZone[name];
        }
        var eventNames = Object.keys(this.events);
        if (eventNames.indexOf(name) !== -1) {
            this.events[name].shift();
            this.events[name].push(cb);
        }
        else {
            this.events[name] = [];
            this.events[name].push(cb);
        }
    };
    return ContextEvent;
}());
function createContext() {
    var context = new ContextEvent();
    var historyMsg = {};
    var registerMsg = function (name) {
        if (!historyMsg[name]) {
            historyMsg[name] = [];
        }
    };
    var hasSameHistoryMsg = function (name, msg) {
        if (historyMsg[name].length > 0) {
            if (!lodash_1.isEqual(historyMsg[name][0], msg)) {
                historyMsg[name].shift();
                historyMsg[name].push(msg);
                return false;
            }
            return true;
        }
        else {
            historyMsg[name].push(msg);
            return false;
        }
    };
    return {
        useSend: function (name, publishByDiffMessage) {
            if (publishByDiffMessage === void 0) { publishByDiffMessage = false; }
            publishByDiffMessage && registerMsg(name);
            var send = react_1.useCallback(function (data) {
                if (publishByDiffMessage) {
                    !hasSameHistoryMsg(name, data) && context.publish(name, data);
                }
                else {
                    context.publish(name, data);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);
            return send;
        },
        useReceive: function (name, callback) {
            var events = react_1.useCallback(function (callback) {
                context.listener(name, callback);
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, []);
            events(callback);
        }
    };
}
exports.default = createContext;
