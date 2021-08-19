import { createLang as create } from './index';

/**
 * Note to future me:
 *
 * lang is permissive with arguments (accepting any string) in this file ONLY because
 * tests are tsignored, which means we're not on strict mode here.
 */

describe(create, () => {
  it('looks up a simple string', () => {
    const lang = create(<const>{ a: 'hello' });
    expect(lang('a')).toBe('hello');
  });

  it('looks up a string inside an object hierarchy', () => {
    const lang = create(<const>{ a: { b: 'hello' } });
    expect(lang('a.b')).toBe('hello');
  });

  it('throws on invalid lookup', () => {
    const lang = create(<const>{ a: 'hello' });
    expect(() => (lang as any)('b')).toThrow('Unknown phrase path: b');
  });

  it('interpolates', () => {
    const lang = create(<const>{ a: 'hello {name}' });
    expect(lang('a', { name: 'dkt' })).toBe('hello dkt');
  });

  it('interpolates inside an object hierarchy', () => {
    const lang = create(<const>{ a: { b: 'hello {name}' } });
    expect(lang('a.b', { name: 'dkt' })).toBe('hello dkt');
  });

  it('interpolates multiple values', () => {
    const lang = create(<const>{ a: '{greet} there, {name}' });
    expect(lang('a', { greet: 'hello', name: 'dkt' })).toBe('hello there, dkt');
  });

  it('interpolates any toString()-able value', () => {
    const lang = create(<const>{ a: 'hello {name}' });
    const name = { toString: () => 'dkt' };
    expect(lang('a', { name })).toBe('hello dkt');
  });

  it('pluralizes', () => {
    const lang = create(<const>{ a: { _: 'some', 1: 'one' } });
    expect(lang('a', { count: 1 })).toBe('one');
    expect(lang('a', { count: 2 })).toBe('some');
  });

  it('returns an object if given a non-leaf path', () => {
    const lang = create(<const>{ a: { b: 'hello' } });
    expect(lang('a')).toEqual({ b: 'hello' });
  });

  it('interpolates inside all the strings of a returned object', () => {
    const lang = create(<const>{ a: { b: 'hello {name}', c: 'good {time}' } });
    expect(lang('a', { name: 'dkt', time: 'day' })).toEqual({
      b: 'hello dkt',
      c: 'good day',
    });
  });
});
