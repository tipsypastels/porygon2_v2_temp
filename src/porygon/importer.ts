import { colors, createLogger } from 'porygon/logger';

interface ImportFnOpts<T> {
  path: string;
  load: () => Promise<T>;
}

interface ImportFn<T> {
  (opts: ImportFnOpts<T>): Promise<void>;
}

const logger = createLogger('import-error', colors.red);

export function createImporter<T>(paths: string[]) {
  return function (fn: ImportFn<T>) {
    const promises = paths.map(async (path) => {
      async function load(exportName = 'default'): Promise<T> {
        return (await import(path))[exportName];
      }

      return fn({ path, load }).catch(onError);
    });

    return Promise.all(promises);
  };
}

function onError(error: any) {
  logger.error(error);
}
