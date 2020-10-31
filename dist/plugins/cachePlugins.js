"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachePlugins = void 0;
/**
 * @file 缓存插件
 * 机制：缓存上一次同一个type的值，如果值一样，就不再dispatch
 */
var lodash_1 = require("lodash");
var Cache = /** @class */ (function () {
    function Cache() {
    }
    Cache.hasCache = function (type, cur) {
        if (!lodash_1.isString(type)) {
            return false;
        }
        if (Cache.cacheData[type]) {
            var prev = Cache.cacheData[type];
            if (lodash_1.isEqual(cur, prev)) {
                return true;
            }
            else {
                Cache.cacheData[type] = cur;
                return false;
            }
        }
        else {
            Cache.cacheData[type] = cur;
            return false;
        }
    };
    Cache.cacheData = {};
    return Cache;
}());
function cachePlugins(globalState) {
    return function (next) {
        return function (action) {
            if (!lodash_1.isFunction(action) && !lodash_1.isFunction(action.payload)) {
                var type = action.type, payload = action.payload;
                var hasCache = Cache.hasCache(type, payload);
                if (hasCache) {
                    console.groupCollapsed("%ctype-" + action.type + " has no change:", 'color: blue');
                    console.log("%c action:", 'color: blue', action);
                    console.log("%c prevState:", 'color: blue', globalState);
                    console.groupEnd();
                }
                else {
                    next(action);
                }
            }
            else {
                next(action);
            }
        };
    };
}
exports.cachePlugins = cachePlugins;
