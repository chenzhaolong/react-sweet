"use strict";
/**
 * @file the repo of Context Component
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderRepo = void 0;
var ProviderRepo = /** @class */ (function () {
    function ProviderRepo() {
    }
    ProviderRepo.saveToRepo = function (key, Context, force) {
        if (force === void 0) { force = false; }
        var keys = Object.keys(ProviderRepo.repos);
        if (keys.indexOf(key) === -1 || force) {
            if (keys.indexOf(key) !== -1) {
                delete ProviderRepo.repos[key];
            }
            ProviderRepo.repos[key] = Context;
        }
    };
    ProviderRepo.getFromRepo = function (key) {
        if (Object.keys(ProviderRepo.repos).indexOf(key) !== -1) {
            return ProviderRepo.repos[key];
        }
        return '';
    };
    ProviderRepo.deleteFromRepo = function (key) {
        if (Object.keys(ProviderRepo.repos).indexOf(key) !== -1) {
            delete ProviderRepo.repos[key];
        }
    };
    ProviderRepo.repos = {};
    return ProviderRepo;
}());
exports.ProviderRepo = ProviderRepo;
