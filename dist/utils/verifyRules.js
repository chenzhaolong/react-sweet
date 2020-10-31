"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file 验证规则
 */
var log_1 = require("./log");
var tools_1 = require("./tools");
exports.default = {
    wordNum: function (options) {
        var val = options.val, min = options.min, max = options.max;
        if (!val) {
            return false;
        }
        // 识别0
        if (!(min + '') || !(max + '')) {
            log_1.warning('has no min and max in verify when the rule is wordNum.');
            return false;
        }
        var minimum = tools_1.isType('string', min) ? parseInt(min) : min;
        var maximum = tools_1.isType('string', max) ? parseInt(max) : max;
        if (minimum >= maximum) {
            log_1.warning('min can not large than or equal to max when the rule is wordNum.');
            return false;
        }
        var length = typeof val === 'number' ? val : val.length ? val.length : -1;
        return length >= minimum && length <= maximum;
    },
    number: function (val) {
        if (!val) {
            return false;
        }
        if (typeof val === 'string') {
            return parseFloat(val) + '' === val;
        }
        return typeof val === 'number';
    },
    noChinese: function (val) {
        var regExp = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
        if (!val) {
            return false;
        }
        return !regExp.test(val);
    },
    specStr: function (val) {
        if (!val) {
            return false;
        }
        var str = /[!@#$%^&*()+?\\\/\-【】（ ）「」{}，,.。]+/;
        var regExp = new RegExp(str, 'g');
        return !regExp.test(val);
    }
};
