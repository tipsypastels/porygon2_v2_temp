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

  // Note: Discord API throws when retrieving perms for a command that doesn't
  // have any set. I assume this has to do with creating them lazily. Either
  // way that's fine we'll just catch that.
  async getPermSummary(guild: Guild) {
    const options = { guild };
    const raw = await this.api.permissions.fetch(options).catch(() => []);
    const entries: PermSummaryEntry[] = [];
    const promises = raw.map(async ({ type, id, permission }) => {
      const manager = type === 'ROLE' ? guild.roles : guild.members;
      const target = await manager.fetch(id).catch(() => null);

      if (target) {
        entries.push({ type, target, permission } as PermSummaryEntry);
      }
    });

    await Promise.all(promises);
    return entries;
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
}
