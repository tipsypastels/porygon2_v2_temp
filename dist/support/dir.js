"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHidden = exports.createDynamicDirectoryList = void 0;
const path_1 = require("path");
const promises_1 = require("fs/promises");
const array_1 = require("support/array");
/**
 * Creates a list of paths dynamically. This is used by auto-importing
 * mechanisms such as the command importer.
 *
 * To use, pass a path segment such as `'../packages/<eachDir>/$package'`.
 * The tokens `<eachDir>` and `<eachFile>` will resolve to each directory
 * or file respectively in the path before that. Only one token of either
 * kind can be present in the path.
 *
 * Returns an array with the fully resolved list.
 */
async function createDynamicDirectoryList(path) {
    const segments = path.split(SEP_BETWEEN_NAMES);
    let output = [];
    let didEncounterDynamic = false;
    function push(str) {
        if (output.length === 0) {
            output = [str];
            return;
        }
        output = output.map((p) => path_1.join(p, str));
    }
    function pushDyn(items) {
        const base = output[0];
        output = items.map((item) => path_1.join(base, item));
    }
    for (const segment of segments) {
        const dyn = getDynamic(segment);
        if (dyn) {
            if (didEncounterDynamic) {
                throw new Error('Multiple dynamic segments are not currently allowed in a path.');
            }
            if (output.length === 0) {
                throw new Error('Dynamic segment may not be the start of a path.');
            }
            didEncounterDynamic = true;
            pushDyn(await (dyn === 'eachFile' ? readFiles : readDirs)(output[0]));
        }
        else {
            push(segment);
        }
    }
    return output;
}
exports.createDynamicDirectoryList = createDynamicDirectoryList;
const DYNAMIC_SEGMENT = /^<(eachFile|eachDir)>$/;
const SEP_BETWEEN_NAMES = new RegExp(`(?<!^)${path_1.sep}(?!$)`);
function getDynamic(segment) {
    return DYNAMIC_SEGMENT.exec(segment)?.[1];
}
async function readFiles(path) {
    return array_1.arrayFromAsyncIter(await each(path, false));
}
async function readDirs(path) {
    return array_1.arrayFromAsyncIter(await each(path, true));
}
async function* each(path, isDirs) {
    const files = await promises_1.readdir(path);
    for (const file of files) {
        if (isHidden(file)) {
            continue;
        }
        if ((await promises_1.stat(path_1.join(path, file))).isDirectory() === isDirs) {
            yield file;
        }
    }
}
function isHidden(path) {
    return path_1.basename(path).startsWith('_');
}
exports.isHidden = isHidden;
