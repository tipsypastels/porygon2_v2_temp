import {
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { Embed } from 'porygon/embed';
import { onDMCommand } from '../../dm';
import { CreateBaseCommand } from '../base';
import { createBaseCommandCall } from '../base/factory';
import { Cell } from '../cell';
import { CommandOptions } from './options';

export type CommandChannel = TextChannel | ThreadChannel;

type CreateCommand<Opts = unknown> = CreateBaseCommand<Args<Opts>, CommandInteraction>;

interface Args<Opts = unknown> {
  client: Porygon;
  opts: CommandOptions<Opts>;
  guild: Guild;
  author: GuildMember;
  channel: CommandChannel;
  embed: Embed;
  intr: CommandInteraction;
  cell: Cell;
}

export type CommandFn<Opts = unknown> = CreateCommand<Opts>['Fn'];
export type Command<Opts = unknown> = CreateCommand<Opts>['Command'];

export const callCommand = createBaseCommandCall<CreateCommand>({
  createArgs(intr, cell) {
    const guild = intr.guild;
    const channel = intr.channel;

    if (!guild) {
      onDMCommand(cell.client, intr);
      return;
    }

    if (!isCommandChannel(channel)) {
      return;
    }

    const client = cell.client;
    const author = intr.member as GuildMember;
    const embed = new Embed();
    const opts = new CommandOptions(intr.options);

    return {
      client,
      guild,
      channel,
      author,
      embed,
      intr,
      opts,
      cell,
    };
  },

  getLoggerCommandName(command) {
    return `/${command.data.name}`;
  },

  getLoggerLocationContext({ channel, guild }) {
    return `${channel.name}, ${guild.name}`;
  },
});

export function isCommandChannel(ch: unknown): ch is CommandChannel {
  return !!ch && (ch instanceof TextChannel || ch instanceof ThreadChannel);
}
