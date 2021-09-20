import { EnvUnwrapped, unwrapEnv } from 'porygon/dev';
import get from 'lodash.get';
import set from 'lodash.set';
import has from 'lodash.has';
import { Path, PathValue } from 'support/path';
import configData from './config_data.json';
import { writeFile } from 'fs/promises';

type ConfigData = typeof configData;
type ConfigPath = Path<ConfigData>;
type Value<P extends Path<ConfigData>> = EnvUnwrapped<PathValue<ConfigData, P>>;
type With<P extends ConfigPath, R> = (value: Value<P>) => R;

export function config<P extends ConfigPath>(path: P) {
  return {
    get value(): Value<P> {
      return unwrapEnv(get(configData, path));
    },
  };
}

export function withConfig<P extends ConfigPath, R>(path: P, fn: With<P, R>) {
  return {
    get value(): R {
      return fn(unwrapEnv(get(configData, path)));
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
  const file = `${__dirname}/config_data.json`;
  const json = JSON.stringify(configData, null, 2);

  writeFile(file, json); // fire-and-forget
}
