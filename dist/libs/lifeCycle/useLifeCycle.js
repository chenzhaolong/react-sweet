"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file this function can return a promise that can touch the section in
 * lifeCycle in a component.
 * eg:
 *    useLifeCycle([deps]).mount(cb).update(cb).destroy(cb)
 */
var react_1 = require("react");
var index_1 = require("../../index");
function useLifeCycle(deps) {
    // @ts-ignore
    var lifeCycle = react_1.useMemo(function () {
        return {
            queue: {
                mount: function () { },
                update: function () { },
                destroy: function () { }
            },
            mount: function (cb) {
                if (cb && typeof cb === 'function') {
                    this.queue.mount = cb;
                }
                return this;
            },
            update: function (cb) {
                if (cb && typeof cb === 'function') {
                    this.queue.update = cb;
                }
                return this;
            },
            destroy: function (cb) {
                if (cb && typeof cb === 'function') {
                    this.queue.destroy = cb;
                }
                return this;
            }
        };
    }, []);
    index_1.useMount({
        // @ts-ignore
        mount: function () {
            lifeCycle.queue.mount();
        },
        clean: function () {
            // @ts-ignore
            if (typeof lifeCycle.queue.destroy === 'function') {
                // @ts-ignore
                lifeCycle.queue.destroy();
            }
        }
    });
    index_1.useUpdate(function () {
        lifeCycle.queue.update();
    }, deps);
    return lifeCycle;
}
exports.default = useLifeCycle;
