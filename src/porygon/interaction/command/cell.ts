import { Plugin } from 'porygon/plugin';
import { BaseCommand } from './base';
import {
  ApplicationCommandPermissionType as PermType,
  ApplicationCommand as Api,
  BaseCommandInteraction,
  GuildMember,
  Role,
  Snowflake,
  Guild,
} from 'discord.js';
import { ContextMenu, callContextMenu } from './context_menu/context_menu';
import { Command, callCommand } from './chat';
import { resolveSnowflake, SnowflakeLike } from 'support/snowflake';
import { searchCommands } from 'porygon/commands';
import { isCellUsableBy } from './usable';

export type PermSummaryEntry =
  | { type: 'ROLE'; target: Role; permission: boolean }
  | { type: 'USER'; target: GuildMember; permission: boolean };

export class Cell {
  constructor(readonly plugin: Plugin, private api: Api, private cmd: BaseCommand) {}

  static withNameOnGuild(name: string, sf: SnowflakeLike) {
    const id = resolveSnowflake(sf);
    return searchCommands((c) => c.name === name && c.isOn(id));
  }

  get id() {
    return this.api.id;
  }

  get name() {
    return this.api.name;
  }

  get client() {
    return this.plugin.client;
  }

  get isGlobal() {
    return !this.api.guildId;
  }

  get defaultPerm() {
    return this.api.defaultPermission;
  }

  setPerm(target: Role | GuildMember, permission: boolean) {
    const type: PermType = target instanceof GuildMember ? 'USER' : 'ROLE';
    const permissions = [{ id: target.id, type, permission }];
    const options: any = { permissions };

    // if this is a global command, it needs context on where to enable it
    if (this.isGlobal) {
      options.guild = target.guild;
    }

    return this.api.permissions.add(options);
  }

  clearPerm(target: Role | GuildMember) {
    const key = target instanceof GuildMember ? 'users' : 'roles';
    const options: any = { [key]: target.id, guild: target.guild };
    return this.api.permissions.remove(options);
  }

  /**
   * @throws If there are no permissions for that command.
   */
  getPerms(guild: Guild) {
    const options = { guild };
    return this.api.permissions.fetch(options);
  }

  call(intr: BaseCommandInteraction): void {
    if (intr.isCommand()) {
      return callCommand(intr, this, this.cmd as Command);
    }

    if (intr.isContextMenu()) {
      return callContextMenu(intr, this, this.cmd as ContextMenu);
    }
  }

  isOn(guildId: Snowflake) {
    return this.isGlobal || this.api.guildId === guildId;
  }

  isUsableBy(member: GuildMember) {
    return isCellUsableBy(this, member);
  }
}
