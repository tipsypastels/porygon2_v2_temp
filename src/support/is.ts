export function isString(x: unknown): x is string {
  return typeof x === 'string';
}

// eslint-disable-next-line
export function isObject(x: unknown): x is object {
  return !!(x && typeof x === 'object');
}

// add more of these as needed
