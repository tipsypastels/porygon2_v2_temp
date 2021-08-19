import { inspect } from 'util';
import { setIntersect } from './set';

/**
 * An object with any shape and properties.
 */
export type AnyObject = Record<PropertyKey, unknown>;

/**
 * An object with any shape and properties, but only string keys.
 */
export type AnyBasicObject = Record<string, unknown>;

/**
 * An object with no properties.
 */
export type Empty = Record<PropertyKey, never>;

/**
 * Changes `K` to be optional, leaving other properties unaffected.
 */
export type PartialKey<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Changes `K` to be required, leaving other properties unaffected.
 */
export type RequiredKey<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 *
 * Creates a tagged union with key `Key`.
 */
export type Tag<T extends Record<string, unknown>, K extends string = 'kind'> = {
  [P in keyof T]: { [Q in K]: P } & T[P] extends infer U
    ? { [Q in keyof U]: U[Q] }
    : never;
};

/**
 * Returns the union of all primtive values in an object tree `T`.
 */
export type Leaf<T> = T extends object ? Leaf<T[keyof T]> : T;

/**
 * Returns the union of all primitive types `R` in an object tree `T`.
 * Primitive values not assignable to `R` are assumed to be `never`.
 */
export type LeafOf<T, R> = T extends object
  ? LeafOf<T[keyof T], R>
  : T extends R
  ? T
  : never;

/**
 * Extracts the only key of `obj`. Throws if there are zero or many keys.
 */
export function extractOnlyKey<T>(obj: T) {
  const keys = Object.keys(obj) as (keyof T & string)[];

  if (keys.length === 0) {
    throw new Error('extractOnlyKey: Failed on empty object.');
  }

  if (keys.length > 1) {
    throw new Error(`extractOnlyKey: Got multiple keys: ${inspect(keys)}.`);
  }

  return keys[0];
}

const DEFAULT_EQ = (a: any, b: any) => a === b;

/**
 * Returns whether all properties shared by `a` and `b` are equal, ignoring
 * other properties. Uses `===` for equality unless a different operator
 * is provided as a callback.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function areSharedPropertiesEqual(a: object, b: object, eq = DEFAULT_EQ) {
  const keys = setIntersect(new Set(Object.keys(a)), new Set(Object.keys(b)));

  for (const key of keys) {
    const aValue = (a as any)[key];
    const bValue = (b as any)[key];

    if (!eq(aValue, bValue)) {
      return false;
    }
  }

  return true;
}
