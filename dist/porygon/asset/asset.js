"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const lang_1 = require("porygon/lang");
const map_1 = require("./map");
const setup_1 = require("./setup");
class Asset {
    constructor(dir, name, ext) {
        this.dir = dir;
        this.name = name;
        this.ext = ext;
        this._url = '';
        if (setup_1.assetSetupIsDone()) {
            throw new Error(lang('dynamic_create'));
        }
        map_1.assetCache(this);
    }
    get path() {
        return `./assets/${this.dir}/${this.name}.${this.ext}`;
    }
    get url() {
        return this._url;
    }
    set url(url) {
        if (setup_1.assetSetupIsDone()) {
            throw new Error(lang('dynamic_set_url'));
        }
        this._url = url;
    }
}
exports.Asset = Asset;
const lang = lang_1.createLang({
    dynamic_create: "Can't create assets dynamically. All assets must be created during setup.",
    dynamic_set_url: "Can't set asset URLs dynamically! All URLs must be fixed during setup.",
});
