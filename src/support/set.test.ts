import { setUnion, setIntersect, setDiff } from './set';

function s<T>(...args: T[]) {
  return new Set(args);
}

describe(setUnion, () => {
  it('includes items in either set', () => {
    const a = s(1, 2, 3);
    const b = s(4, 5, 6);
    const c = setUnion(a, b);

    expect([...c]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('does not duplicate on overlap', () => {
    const a = s(1, 2, 3);
    const b = s(3, 4, 5);
    const c = setUnion(a, b);

    expect([...c]).toEqual([1, 2, 3, 4, 5]);
  });
});

describe(setIntersect, () => {
  it('includes items in both sets', () => {
    const a = s(1, 2, 3);
    const b = s(2, 3, 4);
    const c = setIntersect(a, b);

    expect([...c]).toEqual([2, 3]);
  });
});

describe(setDiff, () => {
  it('includes items in the first set that are not in the second', () => {
    const a = s(1, 2, 3);
    const b = s(2, 3, 4);
    const c = setDiff(a, b);

    expect([...c]).toEqual([1]);
  });
});
