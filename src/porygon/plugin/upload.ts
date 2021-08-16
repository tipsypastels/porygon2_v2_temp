import { ApplicationCommand as Api } from 'discord.js';
import { BaseCommand } from 'porygon/interaction';
import { Plugin } from './plugin';
import { PluginKind } from './kind';
import { areSharedPropertiesEqual } from 'support/object';
import { writeFile } from 'fs/promises';
import { bugLogger, setupLogger } from 'porygon/logger';

type Result = Promise<Api[]>;
type Cache = Record<string, Api>;
const CACHE_FILE = '$command_cache.json';

export class PluginCommandUploader {
  constructor(
    private plugin: Plugin,
    private kind: PluginKind,
    private commands: BaseCommand[],
  ) {}

  private get client() {
    return this.plugin.client;
  }

  private get name() {
    return this.plugin.name;
  }

  async upload(): Result {
    const cache = await this.getCache();
    if (!cache) return await this.uploadAll();

    const changed = this.findChanged(cache);
    if (changed.length === 0) return this.keepAll(cache);

    let apis: Api[];
    if (changed.length === 1) {
      apis = await this.uploadOneChanged(cache, changed[0]);
    } else {
      apis = await this.uploadAll();
    }

    this.setCache(apis); // don't use async, doesn't have to be immediate
    return apis;
  }

  private findChanged(cache: Cache) {
    return this.commands.reduce((list: BaseCommand[], command) => {
      const entry = cache[command.data.name];
      const changed = !entry || !areSharedPropertiesEqual(entry, command.data);
      return changed ? list.concat(command) : list;
    }, []);
  }

  private getCache(): Promise<Cache | null> {
    return import(this.cacheFile).then((m) => m.default).catch(() => null);
  }

  private setCache(apis: Api[]) {
    const cache = apis.reduce((cache: Cache, api) => ({ ...cache, [api.name]: api }), {});
    const cacheJSON = JSON.stringify(cache, null, 2);

    writeFile(this.cacheFile, cacheJSON).catch((e) => {
      bugLogger.warn(`Failed to write command cache for ${this.name}: ${e}`);
    });
  }

  private get cacheFile() {
    return `${this.plugin.location}/${CACHE_FILE}`;
  }

  private uploadAll(): Result {
    setupLogger.debug(`Reuploading all commands for ${this.name}.`);

    const data = this.commands.map((c) => c.data);
    return this.kind.upload(data, this.client);
  }

  private async uploadOneChanged(cache: Cache, change: BaseCommand): Result {
    setupLogger.debug(`Uploading changed command ${change.data.name} for ${this.name}.`);

    const api = await this.kind.uploadOne(change.data, this.client);
    const newApis = { ...cache, ...(api && { [api.name]: api }) };
    return Object.values(newApis);
  }

  private async keepAll(cache: Cache) {
    setupLogger.debug(`Keeping all commands for ${this.name}.`);
    return Object.values(cache);
  }
}
