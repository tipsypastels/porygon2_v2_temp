import { Collection, Snowflake } from 'discord.js';
import { Porygon } from 'porygon/core';
import { Cell, BaseCommand } from 'porygon/interaction';
import { zip } from 'support/array';
import { PluginKind } from './kind';
import { PluginCommandUploader } from './upload';

export class Plugin {
  static ALL = new Collection<PluginKind, Plugin>();
  static SAVED_COMMANDS = new Collection<Snowflake, Cell>();

  private unsavedCommands: BaseCommand[] = [];

  static uploadAllCommands() {
    return Promise.all(this.ALL.map((p) => p.uploadCommands()));
  }

  static init(kind: PluginKind, client: Porygon) {
    return this.ALL.get(kind) || new this(kind, client);
  }

  private constructor(private kind: PluginKind, readonly client: Porygon) {
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
