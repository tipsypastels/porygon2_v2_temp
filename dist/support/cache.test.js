"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./cache");
describe(cache_1.Cache, () => {
    it('lazily computes values', () => {
        const value = {};
        const cache = new cache_1.Cache(() => value);
        expect(cache.get('nonexistantKey')).toBe(value);
    });
    it('can be accessed like a map', () => {
        const value = {};
        const otherValue = {};
        const cache = new cache_1.Cache(() => value);
        cache.cache('key', otherValue);
        expect(cache.get('key')).toBe(otherValue);
    });
    it('can be cleared', () => {
        const value = {};
        const otherValue = {};
        const cache = new cache_1.Cache(() => value);
        cache.cache('key', otherValue);
        cache.uncache('key');
        expect(cache.get('key')).toBe(value);
    });
    it('can be queried', () => {
        const cache = new cache_1.Cache(() => ({}));
        cache.cache('key', 1);
        expect(cache.isCached('key')).toBe(true);
    });
});
describe(cache_1.AsyncCache, () => {
    it('lazily computes values', async () => {
        const value = {};
        const cache = new cache_1.AsyncCache(async () => value);
        expect(await cache.get('nonexistantKey')).toBe(value);
    });
    it('supports promises in the constructor', async () => {
        const value = {};
        const cache = new cache_1.AsyncCache(() => sleepThen(value));
        expect(await cache.get('nonexistantKey')).toBe(value);
    });
    it('can be accessed like a map', async () => {
        const value = {};
        const otherValue = {};
        const cache = new cache_1.AsyncCache(async () => value);
        cache.cache('key', otherValue);
        expect(await cache.get('key')).toBe(otherValue);
    });
    it('can be cleared', async () => {
        const value = {};
        const otherValue = {};
        const cache = new cache_1.AsyncCache(async () => value);
        cache.cache('key', otherValue);
        cache.uncache('key');
        expect(await cache.get('key')).toBe(value);
    });
    it('can be queried', async () => {
        const cache = new cache_1.AsyncCache(async () => ({}));
        cache.cache('key', 1);
        expect(cache.isCached('key')).toBe(true);
    });
});
describe(cache_1.Singleton, () => {
    it('stores a single value', () => {
        const value = {};
        const sing = new cache_1.Singleton(() => value);
        expect(sing.get()).toBe(value);
    });
});
function sleepThen(value) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value), 500);
    });
}
