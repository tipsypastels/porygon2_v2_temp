"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const package_1 = require("porygon/package");
exports.default = package_1.PackageGuild.init(config_1.config('guilds.pokecom').value);
