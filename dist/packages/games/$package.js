"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const kind_1 = require("porygon/package/kind");
exports.default = kind_1.PackageGuild.init(config_1.config('guilds.duck').value);
