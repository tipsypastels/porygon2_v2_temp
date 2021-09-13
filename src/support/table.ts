import { DEV } from 'porygon/dev';

/**
 * An ersatz table acts like a single one-dimensional table in development, but
 * a two-dimensional table in production. This is useful for Porygon's
 * development mode in cases like storing a table of FAQ entries.
 */
export class ErsatzTable<K1, K2, V> {
  private impl: Impl<K1, K2, V>;

  constructor() {
    this.impl = DEV ? new Dev() : new Prod();
  }

  get(k1: K1, k2: K2) {
    return this.impl.get(k1, k2);
  }

  set(k1: K1, k2: K2, value: V) {
    return this.impl.set(k1, k2, value);
  }

  outerKeys() {
    return this.impl.outerKeys();
  }

  innerKeys(outerKey: K1) {
    return this.impl.innerKeys(outerKey);
  }
}

interface Impl<K1, K2, V> {
  get(k1: K1, k2: K2): V | undefined;
  set(k1: K1, k2: K2, value: V): void;
  outerKeys(): K1[];
  innerKeys(k1: K1): K2[];
}

class Dev<K1, K2, V> implements Impl<K1, K2, V> {
  private data = new Map<K2, V>();

  get(_: K1, key: K2) {
    return this.data.get(key);
  }

  set(_: K1, key: K2, value: V) {
    return this.data.set(key, value);
  }

  outerKeys() {
    return [];
  }

  innerKeys(_: K1) {
    return [...this.data.keys()];
  }

  get size() {
    return this.data.size;
  }
}

class Prod<K1, K2, V> implements Impl<K1, K2, V> {
  private data = new Map<K1, Map<K2, V>>();

  get(k1: K1, k2: K2) {
    return this.data.get(k1)?.get(k2);
  }

  set(k1: K1, k2: K2, value: V) {
    if (!this.data.has(k1)) {
      this.data.set(k1, new Map());
    }

    this.data.get(k1)!.set(k2, value);
  }

  outerKeys() {
    return [...this.data.keys()];
  }

  innerKeys(k1: K1) {
    return [...(this.data.get(k1)?.keys() ?? [])];
  }
}
