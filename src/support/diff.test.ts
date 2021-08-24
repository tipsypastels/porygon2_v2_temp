import { Diff } from './diff';

function d<T extends object>(value: T) {
  return new Diff(value);
}

const OBJ = { a: 1, b: 2 };

describe(Diff, () => {
  it('stores the original value', () => {
    const diff = d(OBJ);

    expect(diff.original).toEqual(OBJ);
    expect(diff.current).toEqual(OBJ);
  });

  it('starts with no changes', () => {
    const diff = d(OBJ);

    expect(diff.changes).toEqual({});
    expect(diff.unchanged).toBe(true);
  });

  it('allows changing values', () => {
    const diff = d(OBJ);

    diff.change('a', 3);

    expect(diff.changes).toEqual({ a: 3 });
    expect(diff.current).toEqual({ a: 3, b: 2 });
    expect(diff.unchanged).toBe(false);
  });

  it('allows changing multiple values', () => {
    const diff = d(OBJ);
    const result = diff.apply({ a: 2, b: 3 });

    expect(result).toBe('changed');
    expect(diff.changes).toEqual({ a: 2, b: 3 });
    expect(diff.current).toEqual({ a: 2, b: 3 });
  });

  it('returns changed result if at least one value changed', () => {
    const diff = d(OBJ);
    const result = diff.apply({ a: 1, b: 3 });

    expect(result).toBe('changed');
  });

  it('returns same result if no values changed', () => {
    const diff = d(OBJ);
    const result = diff.apply(OBJ);

    expect(result).toBe('same');
    expect(diff.unchanged).toBe(true);
  });

  it('returns empty if no values passed to apply', () => {
    const diff = d(OBJ);
    const result = diff.apply({});

    expect(result).toBe('empty');
    expect(diff.unchanged).toBe(true);
  });

  it('allows accessing the current value of a key', () => {
    const diff = d(OBJ);

    expect(diff.getCurrent('a')).toBe(1);

    diff.change('a', 2);

    expect(diff.getCurrent('a')).toBe(2);
  });

  it('allows accessing previous value', () => {
    const diff = d(OBJ);
    diff.change('a', 2);

    expect(diff.getState('a')).toEqual({ changed: true, value: 2, prevValue: 1 });
    expect(diff.getState('b')).toEqual({ changed: false, value: 2 });
  });
});
