"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAssets = exports.eachAsset = exports.assetCache = void 0;
const discord_js_1 = require("discord.js");
const MAP = new discord_js_1.Collection();
function assetCache(asset) {
    return MAP.set(asset.path, asset);
}
exports.assetCache = assetCache;
function* eachAsset() {
    for (const [, asset] of MAP) {
        yield asset;
    }
}
exports.eachAsset = eachAsset;
function mapAssets(map) {
    const out = [];
    for (const [, asset] of MAP) {
        out.push(map(asset));
    }
    return out;
}
exports.mapAssets = mapAssets;
