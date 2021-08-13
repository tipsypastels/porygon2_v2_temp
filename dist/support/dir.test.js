"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dir_1 = require("./dir");
jest.mock('fs/promises');
describe(dir_1.createDynamicDirectoryList, () => {
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
        const fs = await Promise.resolve().then(() => __importStar(require('fs/promises')));
        fs.__setMockFiles(MOCK_FILES);
    });
    it('does not affect single-item paths with no dynamic segments', async () => {
        expect(await dir_1.createDynamicDirectoryList('path')).toEqual(['path']);
    });
    it('does not affect multi-item paths with no dynamic segments', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/to')).toEqual(['path/to']);
    });
    it('reads files in a directory', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/f/<eachFile>')).toEqual(['path/f/a', 'path/f/b', 'path/f/c']);
    });
    it('reads directories in a directory', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/d/<eachDir>')).toEqual([
            'path/d/dir1',
            'path/d/dir2',
            'path/d/dir3',
        ]);
    });
    it('can append additional items after the dynamic files', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/f/<eachFile>/xxx')).toEqual([
            'path/f/a/xxx',
            'path/f/b/xxx',
            'path/f/c/xxx',
        ]);
    });
    it('can append additional items after the dynamic directories', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/d/<eachDir>/xxx')).toEqual([
            'path/d/dir1/xxx',
            'path/d/dir2/xxx',
            'path/d/dir3/xxx',
        ]);
    });
    it('errors if a dynamic file is used at the start', () => {
        expect(dir_1.createDynamicDirectoryList('<eachFile>')).rejects.toThrowError('Dynamic segment may not be the start of a path.');
    });
    it('errors if a dynamic directory is used at the start', () => {
        expect(dir_1.createDynamicDirectoryList('<eachDir>')).rejects.toThrowError('Dynamic segment may not be the start of a path.');
    });
    it('errors if multiple dynamic segments are used', () => {
        expect(dir_1.createDynamicDirectoryList('x/<eachFile>/<eachFile>')).rejects.toThrowError('Multiple dynamic segments are not currently allowed in a path.');
    });
    it('treats unknown dynamic segments as regular paths', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/<eachAsdf>/x')).toEqual(['path/<eachAsdf>/x']);
    });
    it('ignores porygon-hidden files', async () => {
        expect(await dir_1.createDynamicDirectoryList('path/h/<eachFile>')).toEqual(['path/h/a']);
    });
});
