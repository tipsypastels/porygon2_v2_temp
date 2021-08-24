import { isEmpty } from './object';

export type DiffChangeResult = 'changed' | 'same' | 'empty';

type State<V> = { changed: true; value: V; prevValue: V } | { changed: false; value: V };

/**
 * A utility for managing changes in objects. Used by rolemod.
 */
export class Diff<T> {
  private _original: T;
  private _changes: Partial<T>;

  constructor(object: T) {
    this._original = object;
    this._changes = {};
  }

  get original() {
    return this._original;
  }

  get changes() {
    return this._changes;
  }

  get current() {
    const current: Partial<T> = {};
    let key: keyof T;

    for (key in this._original) {
      current[key] = this.getCurrent(key);
    }

    return current as T;
  }

  get unchanged() {
    return isEmpty(this._changes);
  }

  getCurrent<K extends keyof T>(key: K) {
    return this._changes[key] ?? this._original[key];
  }

  getState<K extends keyof T>(key: K): State<T[K]> {
    const original = this._original[key];

    if (key in this._changes) {
      const change = this._changes[key]!;
      return { changed: true, value: change, prevValue: original };
    }

    return { changed: false, value: original };
  }

  change<K extends keyof T>(key: K, value: T[K]): DiffChangeResult {
    const prev = this.getCurrent(key);
    if (prev === value) return 'same';

    this._changes[key] = value;
    return 'changed';
  }

  apply(values: Partial<T>): DiffChangeResult {
    if (isEmpty(values)) {
      return 'empty';
    }

    const entries = Object.entries(values) as [keyof T, T[keyof T]][];
    const results = entries.map(([k, v]) => this.change(k, v));
    return results.reduce((acc, cur) => (cur === 'changed' ? cur : acc));
  }
}
