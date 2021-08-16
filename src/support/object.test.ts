import { areSharedPropertiesEqual } from './object';
import eq from 'lodash.isequal';

describe(areSharedPropertiesEqual, () => {
  it('checks shared properties', () => {
    const a = { a: 1, b: 2, c: 3 };
    const b = { b: 2, c: 3, d: 4 };

    expect(areSharedPropertiesEqual(a, b)).toBe(true);
  });

  it('fails on non-matching shared properties', () => {
    const a = { a: 1, b: 3, c: 3 };
    const b = { b: 2, c: 3, d: 4 };

    expect(areSharedPropertiesEqual(a, b)).toBe(false);
  });

  it('uses strict equality by default', () => {
    const a = { unused1: 1, value: { text: 'hello' } };
    const b = { unused2: 1, value: { text: 'hello' } };

    expect(areSharedPropertiesEqual(a, b)).toBe(false);
  });

  it('can be provided with an equality function', () => {
    const a = { unused1: 1, value: { text: 'hello' } };
    const b = { unused2: 1, value: { text: 'hello' } };

    expect(areSharedPropertiesEqual(a, b, eq)).toBe(true);
  });
});
