import { Cache, AsyncCache, Singleton } from './cache';

describe(Cache, () => {
  it('lazily computes values', () => {
    const value = {};
    const cache = new Cache(() => value);

    expect(cache.get('nonexistantKey')).toBe(value);
  });

  it('can be accessed like a map', () => {
    const value = {};
    const otherValue = {};
    const cache = new Cache(() => value);

    cache.cache('key', otherValue);

    expect(cache.get('key')).toBe(otherValue);
  });

  it('can be cleared', () => {
    const value = {};
    const otherValue = {};
    const cache = new Cache(() => value);

    cache.cache('key', otherValue);
    cache.uncache('key');

    expect(cache.get('key')).toBe(value);
  });

  it('can be queried', () => {
    const cache = new Cache(() => ({}));

    cache.cache('key', 1);
    expect(cache.isCached('key')).toBe(true);
  });
});

describe(AsyncCache, () => {
  it('lazily computes values', async () => {
    const value = {};
    const cache = new AsyncCache(async () => value);

    expect(await cache.get('nonexistantKey')).toBe(value);
  });

  it('supports promises in the constructor', async () => {
    const value = {};
    const cache = new AsyncCache(() => sleepThen(value));

    expect(await cache.get('nonexistantKey')).toBe(value);
  });

  it('can be accessed like a map', async () => {
    const value = {};
    const otherValue = {};
    const cache = new AsyncCache(async () => value);

    cache.cache('key', otherValue);

    expect(await cache.get('key')).toBe(otherValue);
  });

  it('can be cleared', async () => {
    const value = {};
    const otherValue = {};
    const cache = new AsyncCache(async () => value);

    cache.cache('key', otherValue);
    cache.uncache('key');

    expect(await cache.get('key')).toBe(value);
  });

  it('can be queried', async () => {
    const cache = new AsyncCache(async () => ({}));

    cache.cache('key', 1);
    expect(cache.isCached('key')).toBe(true);
  });
});

describe(Singleton, () => {
  it('stores a single value', () => {
    const value = {};
    const sing = new Singleton(() => value);

    expect(sing.get()).toBe(value);
  });
});

function sleepThen<T>(value: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(value), 500);
  });
}
