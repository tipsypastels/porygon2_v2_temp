"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImporter = void 0;
const logger_1 = require("porygon/logger");
const logger = logger_1.createLogger('import-error', logger_1.colors.red);
function createImporter(paths) {
    return function (fn) {
        const promises = paths.map(async (path) => {
            async function load(exportName = 'default') {
                return (await Promise.resolve().then(() => __importStar(require(path))))[exportName];
            }
            return fn({ path, load }).catch(onError);
        });
        return Promise.all(promises);
    };
}
exports.createImporter = createImporter;
function onError(error) {
    logger.error(error);
}
