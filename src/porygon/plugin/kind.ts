import {
  ApplicationCommand as Api,
  ApplicationCommandData as Data,
  Collection,
  Snowflake,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { config } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { bugLogger } from 'porygon/logger';
import { Cache, Singleton } from 'support/cache';

const DEV_SERVER = config('dev_server');

/**
 * A unique ID for a plugin. Each plugin directory exports one of these from
 * its `$package` file. Plugins with the same `PluginKind` are in fact the same
 * object. See `Plugin` for why this is done.
 *
 * `PluginKind`s encapsulate bits of logic that are different between different
 * upload destinations. Getting a unique ID for that target, determining if a
 * potential guild matches that target, and uploading one or several commands
 * to that target.
 *
 * Note that in development, all `PluginKind`s are replaced with a single
 * unique `PluginDev`, this ensures that development commands are uploaded
 * to the test guild (not globally, which is slower) in a single batch. One
 * side effect of this is that any code operating on a known `PluginKind`
 * must assume it may be interacting with a `PluginDev` instead, this
 * is relevant when calling methods on kinds beyond those defined in
 * the interface.
 */
export interface PluginKind {
  tag: string;
  matches(guildId: Snowflake | undefined): boolean;
  upload(data: Data[], client: Porygon): Promise<Api[]>;
}

export type PluginKindOrDev<T extends PluginKind> = T | PluginDev;

export class PluginDev implements PluginKind {
  private static MEMO = new Singleton(() => new PluginDev());

  static init() {
    if (!DEV) {
      bugLogger.error('Tried to create a PluginDev in production.');
    }

    return this.MEMO.get();
  }

  private constructor() {
    /* nop */
  }

  get tag() {
    return 'dev';
  }

  guild(client: Porygon) {
    return client.guilds.cache.get(DEV_SERVER.value)!;
  }

  matches() {
    return true;
  }

  async upload(data: Data[], client: Porygon) {
    return toArray(await this.guild(client).commands.set(data));
  }
}

export class PluginGlobal implements PluginKind {
  private static MEMO = new Singleton(() => new PluginGlobal());

  static init() {
    return this.MEMO.get();
  }

  private constructor() {
    /* nop */
  }

  get tag() {
    return 'global';
  }

  matches() {
    return true;
  }

  async upload(data: Data[], client: Porygon) {
    return toArray(await client.application!.commands.set(data));
  }
}

export class PluginGuild implements PluginKind {
  private static ALL = new Cache((guildId: Snowflake) => {
    return new PluginGuild(guildId);
  });

  static init(guildId: Snowflake) {
    return this.ALL.get(guildId);
  }

  private constructor(private guildId: Snowflake) {
    /* nop */
  }

  get tag() {
    return `guild_${this.guildId}`;
  }

  guild(client: Porygon) {
    return client.guilds.cache.get(this.guildId);
  }

  matches(guildId: Snowflake | undefined) {
    return this.guildId === guildId;
  }

  async upload(data: Data[], client: Porygon) {
    const guild = this.guild(client);
    return toArray(await guild?.commands.set(data));
  }
}

export class PluginGuilds implements PluginKind {
  // it's not safe to store guild IDs directly since they'll
  // clobber other commands from that guild
  private plugins: PluginGuild[];

  constructor(guildIds: Snowflake[]) {
    this.plugins = guildIds.map((id) => PluginGuild.init(id));
  }

  get tag() {
    return `guilds_${this.plugins.map((p) => p.tag).join('_')}`;
  }

  matches(guildId: Snowflake | undefined) {
    return !!guildId && this.plugins.some((p) => p.matches(guildId));
  }

  async upload(data: Data[], client: Porygon) {
    const promises = this.plugins.map((p) => p.upload(data, client));
    const [commands] = await Promise.all(promises);

    return commands; // all entries are the same
  }
}

function toArray<V>(collection: Collection<unknown, V> | undefined): V[] {
  return collection ? [...collection.values()] : [];
}
