"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetGroup = void 0;
const discord_js_1 = require("discord.js");
const range_1 = require("support/range");
const asset_1 = require("./asset");
class AssetGroup {
    constructor(dir, files) {
        this.assets = new discord_js_1.Collection();
        for (const [name, ext] of files) {
            const asset = new asset_1.Asset(dir, name, ext);
            this.assets.set(name, asset);
        }
    }
    static range(end, ext) {
        return new range_1.InclusiveRange(0, end).map((i) => [i, ext]);
    }
    *[Symbol.iterator]() {
        for (const [, asset] of this.assets) {
            yield asset;
        }
    }
    get(key) {
        return this.assets.get(key);
    }
    random() {
        return this.assets.random();
    }
}
exports.AssetGroup = AssetGroup;
