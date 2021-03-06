import {
  ApplicationCommand as Api,
  ApplicationCommandData as Data,
  Collection,
  Guild,
  Snowflake,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { config } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { Cache, Singleton } from 'support/cache';
import { GuildConfigName } from 'porygon/guilds';
import { logger } from 'porygon/logger';

const DEV_SERVER = config('guilds.dev.id');

/**
 * A unique ID for a plugin. Each plugin directory exports one of these from
 * its `$plugin` file. Plugins with the same `PluginKind` are in fact the same
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
  getChildKinds?(): PluginKind[];
}

export interface PluginKindGuilded extends PluginKind {
  guildId: Snowflake;
  guild(client: Porygon): Guild | undefined;
}

export type PluginKindOrDev<T extends PluginKind> = T | PluginDev;

export class PluginDev implements PluginKindGuilded {
  private static MEMO = new Singleton(() => new PluginDev());

  static init() {
    if (!DEV) {
      logger.bug.error('Tried to create a PluginDev in production.');
    }

    return this.MEMO.get();
  }

  private constructor() {
    /* nop */
  }

  get tag() {
    return 'Dev';
  }

  get guildId() {
    return DEV_SERVER.value;
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
    return 'Global';
  }

  matches() {
    return true;
  }

  async upload(data: Data[], client: Porygon) {
    return toArray(await client.application!.commands.set(data));
  }
}

export class PluginGuild implements PluginKindGuilded {
  private static ALL = new Cache((name: GuildConfigName) => {
    return new PluginGuild(name);
  });

  static init(name: GuildConfigName) {
    return this.ALL.get(name);
  }

  readonly guildId: string;

  private constructor(private name: GuildConfigName) {
    this.guildId = config(`guilds.${name}.id`).value;
  }

  get tag() {
    return `Guild(${this.name})`;
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
  static init(...names: GuildConfigName[]) {
    return new this(names);
  }

  // it's not safe to upload guild IDs directly since they'll
  // clobber other commands from that guild
  private plugins: PluginGuild[];

  private constructor(private names: GuildConfigName[]) {
    this.plugins = names.map((name) => PluginGuild.init(name));
  }

  get tag() {
    return `Guilds(${this.names.join(', ')})`;
  }

  matches(guildId: Snowflake | undefined) {
    return !!guildId && this.plugins.some((p) => p.matches(guildId));
  }

  async upload() {
    return []; // upload is deferred to children
  }

  getChildKinds() {
    return this.plugins;
  }
}

export function isGuildedKind(kind: PluginKind): kind is PluginKindGuilded {
  return typeof (kind as PluginKindGuilded).guild === 'function';
}

function toArray<V>(collection: Collection<unknown, V> | undefined): V[] {
  return collection ? [...collection.values()] : [];
}
