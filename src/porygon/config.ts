import { EnvUnwrapped, unwrapEnv } from 'porygon/dev';
import get from 'lodash.get';
import set from 'lodash.set';
import has from 'lodash.has';
import { Path, PathValue } from 'support/path';
import configData from '../../config_data.json';
import { writeFile } from 'fs/promises';
import { logger } from './logger';

type ConfigData = typeof configData;
type Value<P extends Path<ConfigData>> = EnvUnwrapped<PathValue<ConfigData, P>>;

export function config<P extends Path<ConfigData>>(path: P) {
  return {
    get value(): Value<P> {
      return unwrapEnv(get(configData, path));
    },
  };
}

// not worth type checking this as it's only ever called via /eval currently
export function setConfig(key: string, value: any) {
  assertConfigExists(key);
  set(configData, key, value);
  overwriteConfigFile();
}

function assertConfigExists(key: string) {
  if (!has(configData, key)) {
    throw new Error(`No such config key: ${key}`);
  }
}

function overwriteConfigFile() {
  const file = 'config_data.json';
  const json = JSON.stringify(configData, null, 2);

  writeFile(file, json).catch((error) => {
    logger.bug.error(`Failed to apply changes to config file: ${error}.`);
  });
}
