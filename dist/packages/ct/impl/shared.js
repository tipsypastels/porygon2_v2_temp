"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctLogger = exports.CtConfig = void 0;
const config_1 = require("porygon/config");
const logger_1 = require("porygon/logger");
const colors_1 = __importDefault(require("colors"));
exports.CtConfig = {
    // don't assign directly so we can retain
    // the ability of config to change at runtime
    get roleId() {
        return config_1.config('pkg.ct.role').value;
    },
    get threshold() {
        return config_1.config('pkg.ct.threshold').value;
    },
    get ppmExceptions() {
        return config_1.config('pkg.ct.ppm_exceptions').value;
    },
};
exports.ctLogger = logger_1.createLogger('cooltrainer', colors_1.default.bgBlue);
