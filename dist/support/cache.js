"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = exports.AsyncCache = exports.Cache = void 0;
const discord_js_1 = require("discord.js");
class BaseCache {
    constructor() {
        this.collection = new discord_js_1.Collection();
    }
    isCached(key) {
        return this.collection.has(key);
    }
    cache(key, value) {
        this.collection.set(key, value);
    }
    uncache(key) {
        this.collection.delete(key);
    }
}
class Cache extends BaseCache {
    constructor(_default) {
        super();
        this._default = _default;
    }
    get(key) {
        const currentValue = this.collection.get(key);
        if (typeof currentValue !== 'undefined') {
            return currentValue;
        }
        const newValue = this._default(key);
        this.cache(key, newValue);
        return newValue;
    }
}
exports.Cache = Cache;
class AsyncCache extends BaseCache {
    constructor(_default) {
        super();
        this._default = _default;
    }
    async get(key) {
        const currentValue = this.collection.get(key);
        if (typeof currentValue !== 'undefined') {
            return currentValue;
        }
        const newValue = await this._default(key);
        this.cache(key, newValue);
        return newValue;
    }
}
exports.AsyncCache = AsyncCache;
const UNSET_SENTINEL = Symbol('UNSET_SENTINEL');
class Singleton {
    constructor(_default) {
        this._default = _default;
        this.value = UNSET_SENTINEL;
    }
    get() {
        if (this.value === UNSET_SENTINEL) {
            this.value = this._default();
        }
        return this.value;
    }
}
exports.Singleton = Singleton;
