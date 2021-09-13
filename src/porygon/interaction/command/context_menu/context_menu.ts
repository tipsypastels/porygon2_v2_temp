import {
  ContextMenuInteraction,
  Guild,
  GuildMember,
  Message,
  MessageApplicationCommandData,
  UserApplicationCommandData,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { Embed } from 'porygon/embed';
import { logger } from 'porygon/logger';
import { onDMCommand } from '../../dm';
import { CreateBaseCommand } from '../base';
import { createBaseCommandCall } from '../base/factory';
import { Cell } from '../cell';

interface BaseArgs {
  client: Porygon;
  guild: Guild;
  author: GuildMember;
  embed: Embed;
  intr: ContextMenuInteraction;
  cell: Cell;
}

interface UserArgs extends BaseArgs {
  member: GuildMember;
}

interface MsgArgs extends UserArgs {
  message: Message;
}

type Create = CreateBaseCommand<
  BaseArgs,
  ContextMenuInteraction,
  UserApplicationCommandData | MessageApplicationCommandData
>;
type CreateUser = CreateBaseCommand<
  UserArgs,
  ContextMenuInteraction,
  UserApplicationCommandData
>;
type CreateMsg = CreateBaseCommand<
  MsgArgs,
  ContextMenuInteraction,
  MessageApplicationCommandData
>;

export type UserContextMenu = CreateUser['Command'];
export type MsgContextMenu = CreateMsg['Command'];
export type ContextMenu = Create['Command'];

export const callContextMenu = createBaseCommandCall<Create>({
  createArgs(intr, cell) {
    const client = cell.client;
    const { guild, member: author } = intr;
    const embed = new Embed();

    if (!guild) {
      onDMCommand(client, intr);
      return;
    }

    if (!(author instanceof GuildMember)) {
      return;
    }

    return merge({
      client,
      guild,
      author,
      embed,
      intr,
      cell,
    });
  },

  getLoggerCommandName(command) {
    const type = (command.data.type as string).toLowerCase();
    return `${type} menu ${command.data.name}`;
  },
});

function merge(args: Create['Args']): Create['Args'] | undefined {
  if (args.intr.targetType === 'MESSAGE') {
    const message = args.intr.options.getMessage('message', true);

    if (!(message instanceof Message)) {
      logger.intr.debug('MsgContextMenu received an invalid message, aborting...');
      return;
    }

    (args as CreateMsg['Args']).message = message;
  } else {
    const member = args.intr.options.getMember('user', true);

    if (!(member instanceof GuildMember)) {
      logger.intr.debug('MsgContextMenu received an invalid member, aborting...');
      return;
    }

    (args as CreateUser['Args']).member = member;
  }

  return args;
}
