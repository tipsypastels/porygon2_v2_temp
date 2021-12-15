import { parseColor as p } from './color';

const ERROR = 'Invalid color!';

describe(p, () => {
  it('parses a hex', () => {
    expect(p('#ff0000')).toEqual(16711680);
    expect(p('#00ff00')).toEqual(65280);
    expect(p('#0000ff')).toEqual(255);
  });

  it("doesn't require a pound sign", () => {
    expect(p('ff0000')).toEqual(16711680);
    expect(p('00ff00')).toEqual(65280);
    expect(p('0000ff')).toEqual(255);
  });

  it("doesn't support shortform", () => {
    expect(() => p('f00')).toThrowError(ERROR);
    expect(() => p('#f00')).toThrowError(ERROR);
  });

  it('fails on arbitrary input', () => {
    expect(() => p('hello, world!')).toThrowError(ERROR);
  });
});
