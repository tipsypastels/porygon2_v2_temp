import { first, last, random, toSentence, zip } from './array';

describe(random, () => {
  it('outputs a random number in range', () => {
    const ary = [1, 2, 3, 4, 5];
    expect(ary).toContain(random(ary));
  });
});

describe(zip, () => {
  it('zips two arrays together', () => {
    const a1 = [1, 2, 3];
    const a2 = [4, 5, 6];

    expect(Array.from(zip(a1, a2))).toEqual([
      [1, 4],
      [2, 5],
      [3, 6],
    ]);
  });

  it('stops at the length of the shortest array', () => {
    const a1 = [1, 2, 3];
    const a2 = [4, 5];

    expect(Array.from(zip(a1, a2))).toEqual([
      [1, 4],
      [2, 5],
    ]);
  });

  it('yields nothing for an empty array', () => {
    const a1 = [1, 2, 3];
    const a2: any[] = [];

    expect(Array.from(zip(a1, a2))).toEqual([]);
  });
});

describe(first, () => {
  it('returns the first item of an array', () => {
    expect(first([1, 2, 3])).toBe(1);
  });

  it('returns undefined for empty array', () => {
    expect(first([])).toBe(undefined);
  });
});

describe(last, () => {
  it('returns the last item of an array', () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it('returns undefined for empty array', () => {
    expect(last([])).toBe(undefined);
  });
});

describe(toSentence, () => {
  it('joins terms into a sentence', () => {
    expect(toSentence(['a', 'b', 'c'])).toBe('a, b, and c');
  });

  it('uses and to join two terms', () => {
    expect(toSentence(['a', 'b'])).toBe('a and b');
  });

  it('does not change a single term', () => {
    expect(toSentence(['a'])).toBe('a');
  });

  it('returns an empty string for none', () => {
    expect(toSentence([])).toBe('');
  });
});
