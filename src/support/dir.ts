import { join, sep, basename } from 'path';
import { readdir, stat } from 'fs/promises';
import { arrayFromAsyncIter } from 'support/array';

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
export async function createDynamicDirectoryList(path: string) {
  const segments = path.split(SEP_BETWEEN_NAMES);

  let output: string[] = [];
  let didEncounterDynamic = false;

  function push(str: string) {
    if (output.length === 0) {
      output = [str];
      return;
    }

    output = output.map((p) => join(p, str));
  }

  function pushDyn(items: string[]) {
    const base = output[0];
    output = items.map((item) => join(base, item));
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
    } else {
      push(segment);
    }
  }

  return output;
}

const DYNAMIC_SEGMENT = /^<(eachFile|eachDir)>$/;
const SEP_BETWEEN_NAMES = new RegExp(`(?<!^)${sep}(?!$)`);

function getDynamic(segment: string) {
  return DYNAMIC_SEGMENT.exec(segment)?.[1];
}

async function readFiles(path: string) {
  return arrayFromAsyncIter(await each(path, false));
}

async function readDirs(path: string) {
  return arrayFromAsyncIter(await each(path, true));
}

async function* each(path: string, isDirs: boolean) {
  const files = await readdir(path);

  for (const file of files) {
    if (isHidden(file)) {
      continue;
    }

    if ((await stat(join(path, file))).isDirectory() === isDirs) {
      yield file;
    }
  }
}
export function isHidden(path: string) {
  return basename(path).startsWith('_');
}
