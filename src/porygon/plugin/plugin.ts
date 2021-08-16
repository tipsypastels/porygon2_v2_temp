import { ApplicationCommand as Api, Collection, Snowflake } from 'discord.js';
import { basename } from 'path';
import { Porygon } from 'porygon/core';
import { BaseCommand, Cell } from 'porygon/interaction';
import { zip } from 'support/array';
import { PluginKind } from './kind';
import { PluginCommandUploader } from './upload';

type Cache = Record<string, Api>;
const CACHE_FILE = '$command_cache.json';

export class Plugin {
  static ALL = new Collection<PluginKind, Plugin>();
  static SAVED_COMMANDS = new Collection<Snowflake, Cell>();

  static uploadAllCommands() {
    return Promise.all(this.ALL.map((p) => p.uploadCommands()));
  }

  static init(kind: PluginKind, location: string, client: Porygon) {
    return this.ALL.get(kind) || new this(kind, location, client);
  }

  readonly name: string;
  private unsavedCommands: BaseCommand[] = [];

  private constructor(
    private kind: PluginKind,
    readonly location: string,
    readonly client: Porygon,
  ) {
    this.name = basename(location);

    Plugin.ALL.set(kind, this);
  }

  addCommand(command: BaseCommand) {
    this.unsavedCommands.push(command);
  }

  private async uploadCommands() {
    const uploader = new PluginCommandUploader(this, this.kind, this.unsavedCommands);
    const apis = await uploader.upload();

    for (const [command, api] of zip(this.unsavedCommands, apis)) {
      const ref = new Cell(this, api, command);
      Plugin.SAVED_COMMANDS.set(ref.id, ref);
    }

    this.unsavedCommands = [];
  }
}
