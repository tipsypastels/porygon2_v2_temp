import { inspect } from 'util';

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
