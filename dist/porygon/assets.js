"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPERIMENT_ASSETS = exports.HEADPAT_ASSETS = exports.HANGMAN_ASSETS = exports.PORY_ASSETS_V3 = exports.PORY_ASSETS = exports.COIN_ASSETS = void 0;
const asset_1 = require("./asset");
exports.COIN_ASSETS = new asset_1.AssetGroup('coins', [
    ['heads', 'png'],
    ['tails', 'png'],
]);
exports.PORY_ASSETS = new asset_1.AssetGroup('unused/pory_thumbs_v2', [
    ['8ball', 'png'],
    ['angry', 'png'],
    ['danger', 'png'],
    ['error', 'png'],
    ['plead', 'png'],
    ['smile', 'png'],
    ['speech', 'png'],
    ['thanos', 'png'],
    ['vibe', 'png'],
    ['warning', 'png'],
]);
exports.PORY_ASSETS_V3 = new asset_1.AssetGroup('pory', [
    ['plead', 'png'],
    ['smile', 'png'],
]);
exports.HANGMAN_ASSETS = new asset_1.AssetGroup('hangman', asset_1.AssetGroup.range(10, 'png'));
exports.HEADPAT_ASSETS = new asset_1.AssetGroup('headpats', asset_1.AssetGroup.range(33, 'gif'));
exports.EXPERIMENT_ASSETS = new asset_1.AssetGroup('experiments', [
    ['potenuse', 'jpg'],
]);
