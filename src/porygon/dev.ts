export const DEV = process.env.NODE_ENV !== 'production';

/**
 * Represents a value that may be provided literally, or wrapped
 * in an object with `dev` and `prod` keys.
 */
export type EnvWrapper<T> = T | { prod: T; dev: T };
export type EnvUnwrapped<T> = T extends EnvWrapper<infer R> ? R : T;

/** @see EnvWrapper */
export function unwrapEnv<T>(wrapper: EnvWrapper<T>): T {
  if (typeof wrapper === 'object' && 'prod' in wrapper) {
    return wrapper[DEV ? 'dev' : 'prod'];
  }

  return wrapper;
}
