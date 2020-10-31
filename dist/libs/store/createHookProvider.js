"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @file store of Component
 */
var react_1 = __importDefault(require("react"));
var log_1 = require("../../utils/log");
var lodash_1 = require("lodash");
var ProviderRepo_1 = require("../../utils/ProviderRepo");
function createHookProvider(options) {
    var key = options.key, _a = options.force, force = _a === void 0 ? false : _a;
    if (!lodash_1.isString(key)) {
        log_1.error('the key must exist when invoke createHookProvider.');
    }
    // @ts-ignore
    var StoreContext = react_1.default.createContext();
    ProviderRepo_1.ProviderRepo.saveToRepo(key, StoreContext, force);
    return { Provider: StoreContext.Provider, Consumer: StoreContext.Consumer };
}
exports.default = createHookProvider;
