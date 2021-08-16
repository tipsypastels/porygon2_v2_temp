import { ellipsis, ELLIPSIS } from './string';

describe(ellipsis, () => {
  it('leaves empty strings unchanged', () => {
    expect(ellipsis('', 10)).toBe('');
  });

  it('leaves short strings unchanged', () => {
    expect(ellipsis('hi', 10)).toBe('hi');
  });

  it('leaves strings the same length unchanged', () => {
    expect(ellipsis('hi', 2)).toBe('hi');
  });

  it('adds an elipsis to longer strings', () => {
    expect(
      ellipsis(
        'The Oxford Style Guide recommends setting the ellipsis as a single character.',
        33,
      ),
    ).toBe(`The Oxford Style Guide recommends${ELLIPSIS}`);
    expect(ellipsis('hi', 1)).toBe(`h${ELLIPSIS}`);
  });
});
