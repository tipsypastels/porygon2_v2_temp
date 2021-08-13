import { createDynamicDirectoryList as d } from './dir';

jest.mock('fs/promises');

describe(d, () => {
  const MOCK_FILES = [
    'path/f/a',
    'path/f/b',
    'path/f/c',
    'path/f/dir',
    'path/d/dir1',
    'path/d/dir2',
    'path/d/dir3',
    'path/d/dir3/a',
    'path/d/dir3/b',
    'path/d/f',
    'path/h/a',
    'path/h/_b',
  ];

  beforeEach(async () => {
    const fs: any = await import('fs/promises');
    fs.__setMockFiles(MOCK_FILES);
  });

  it('does not affect single-item paths with no dynamic segments', async () => {
    expect(await d('path')).toEqual(['path']);
  });

  it('does not affect multi-item paths with no dynamic segments', async () => {
    expect(await d('path/to')).toEqual(['path/to']);
  });

  it('reads files in a directory', async () => {
    expect(await d('path/f/<eachFile>')).toEqual(['path/f/a', 'path/f/b', 'path/f/c']);
  });

  it('reads directories in a directory', async () => {
    expect(await d('path/d/<eachDir>')).toEqual([
      'path/d/dir1',
      'path/d/dir2',
      'path/d/dir3',
    ]);
  });

  it('can append additional items after the dynamic files', async () => {
    expect(await d('path/f/<eachFile>/xxx')).toEqual([
      'path/f/a/xxx',
      'path/f/b/xxx',
      'path/f/c/xxx',
    ]);
  });

  it('can append additional items after the dynamic directories', async () => {
    expect(await d('path/d/<eachDir>/xxx')).toEqual([
      'path/d/dir1/xxx',
      'path/d/dir2/xxx',
      'path/d/dir3/xxx',
    ]);
  });

  it('errors if a dynamic file is used at the start', () => {
    expect(d('<eachFile>')).rejects.toThrowError(
      'Dynamic segment may not be the start of a path.',
    );
  });

  it('errors if a dynamic directory is used at the start', () => {
    expect(d('<eachDir>')).rejects.toThrowError(
      'Dynamic segment may not be the start of a path.',
    );
  });

  it('errors if multiple dynamic segments are used', () => {
    expect(d('x/<eachFile>/<eachFile>')).rejects.toThrowError(
      'Multiple dynamic segments are not currently allowed in a path.',
    );
  });

  it('treats unknown dynamic segments as regular paths', async () => {
    expect(await d('path/<eachAsdf>/x')).toEqual(['path/<eachAsdf>/x']);
  });

  it('ignores porygon-hidden files', async () => {
    expect(await d('path/h/<eachFile>')).toEqual(['path/h/a']);
  });
});
