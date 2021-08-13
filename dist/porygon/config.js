"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setConfig = exports.config = void 0;
const dev_1 = require("porygon/dev");
const lodash_get_1 = __importDefault(require("lodash.get"));
const lodash_set_1 = __importDefault(require("lodash.set"));
const lodash_has_1 = __importDefault(require("lodash.has"));
const config_data_json_1 = __importDefault(require("./config_data.json"));
const promises_1 = require("fs/promises");
function config(path) {
    return {
        get value() {
            return dev_1.unwrapEnv(lodash_get_1.default(config_data_json_1.default, path));
        },
    };
}
exports.config = config;
// not worth type checking this as it's only ever called via /eval currently
function setConfig(key, value) {
    assertConfigExists(key);
    lodash_set_1.default(config_data_json_1.default, key, value);
    overwriteConfigFile();
}
exports.setConfig = setConfig;
function assertConfigExists(key) {
    if (!lodash_has_1.default(config_data_json_1.default, key)) {
        throw new Error(`No such config key: ${key}`);
    }
}
function overwriteConfigFile() {
    const file = `${__dirname}/config_data.json`;
    const json = JSON.stringify(config_data_json_1.default, null, 2);
    promises_1.writeFile(file, json); // fire-and-forget
}
