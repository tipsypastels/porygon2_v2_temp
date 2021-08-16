import { ContextMenuInteraction, Guild, GuildMember, Message } from 'discord.js';
import { Porygon } from 'porygon/core';
import { Embed } from 'porygon/embed';
import { catchIntrError } from 'porygon/interaction/catch';
import { intrLogger } from 'porygon/interaction/logger';
import { createLang } from 'porygon/lang';
import { BaseCommand, BaseCommandCallFn, BaseCommandFn } from '../base';
import { Cell } from '../cell';

export interface BaseContextMenuFnArgs {
  client: Porygon;
  guild: Guild;
  author: GuildMember;
  embed: Embed;
  intr: ContextMenuInteraction;
  cell: Cell;
}

export interface UserContextMenuFnArgs extends BaseContextMenuFnArgs {
  member: GuildMember;
}

export interface MsgContextMenuFnArgs extends BaseContextMenuFnArgs {
  message: Message;
}

export type UserContextMenuFn = BaseCommandFn<UserContextMenuFnArgs>;
export type MsgContextMenuFn = BaseCommandFn<MsgContextMenuFnArgs>;

export type UserContextMenu = BaseCommand<UserContextMenuFn>;
export type MsgContextMenu = BaseCommand<MsgContextMenuFn>;

export type ContextMenu = UserContextMenu | MsgContextMenu;

export type ContextMenuCallFn = BaseCommandCallFn<ContextMenu, ContextMenuInteraction>;

export const callContextMenu: ContextMenuCallFn = (intr, cell, command) => {
  const client = cell.client;
  const { guild, member: author } = intr;
  const embed = new Embed();

  if (!guild || !(author instanceof GuildMember)) {
    return;
  }

  const args = merge({
    client,
    guild,
    author,
    embed,
    intr,
    cell,
  });

  if (!args) {
    return;
  }

  log(command(args), args);
};

function merge(args: BaseContextMenuFnArgs) {
  if (args.intr.targetType === 'MESSAGE') {
    const message = args.intr.options.getMessage('message', true);

    if (!(message instanceof Message)) {
      intrLogger.debug('MsgContextMenu received an invalid message, aborting...');
      return;
    }

    (args as MsgContextMenuFnArgs).message = message;
  } else {
    const member = args.intr.options.getMember('user', true);

    if (!(member instanceof GuildMember)) {
      intrLogger.debug('MsgContextMenu received an invalid member, aborting...');
      return;
    }

    (args as UserContextMenuFnArgs).member = member;
  }

  return args as MsgContextMenuFnArgs & UserContextMenuFnArgs;
}

function log(result: Promise<void>, args: BaseContextMenuFnArgs) {
  const params = {
    author: args.author.user.username,
    type: args.intr.targetType.toLowerCase(),
    guild: args.guild.name,
    cmd: args.cell.name,
  };

  result
    .then(() => intrLogger.info(lang('ok', params)))
    .catch((error) =>
      catchIntrError(error, args.intr, () => intrLogger.error(lang('err', params))),
    );
}

const lang = createLang(<const>{
  ok: '{author} used {type} menu {cmd} in {guild}.',
  err: '{author} encountered a crash using {type} menu {cmd} in {guild}. More details may be above.',
});
