import { Collection, Snowflake } from 'discord.js';
import { Porygon } from 'porygon/core';
import { Cell, BaseCommand } from 'porygon/interaction';
import { zip } from 'support/array';
import { PackageKind } from './kind';

export class Package {
  static ALL = new Collection<PackageKind, Package>();
  static SAVED_COMMANDS = new Collection<Snowflake, Cell>();

  private unsavedCommands: BaseCommand[] = [];

  static uploadAllCommands() {
    return Promise.all(this.ALL.map((p) => p.uploadCommands()));
  }

  static init(kind: PackageKind, client: Porygon) {
    return this.ALL.get(kind) || new this(kind, client);
  }

  private constructor(private kind: PackageKind, readonly client: Porygon) {
    Package.ALL.set(kind, this);
  }

  addCommand(command: BaseCommand) {
    this.unsavedCommands.push(command);
  }

  async uploadCommands() {
    const data = this.unsavedCommands.map((c) => c.data);
    const apis = await this.kind.upload(data, this.client);

    for (const [command, api] of zip(this.unsavedCommands, apis)) {
      const ref = new Cell(this, api, command);
      Package.SAVED_COMMANDS.set(ref.id, ref);
    }

    this.unsavedCommands = [];
  }
}
