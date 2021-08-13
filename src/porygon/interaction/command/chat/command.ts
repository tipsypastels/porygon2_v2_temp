import {
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { Embed } from 'porygon/embed';
import { catchIntrError } from 'porygon/interaction/catch';
import { intrLogger } from 'porygon/interaction/logger';
import { CommandOptions } from './options';
import { Cell } from '../cell';
import { BaseCommand, BaseCommandCallFn, BaseCommandFn } from '../base';
import { createLang } from 'porygon/lang';

export type CommandChannel = TextChannel | ThreadChannel;

export interface CommandFnArgs<Opts = unknown> {
  client: Porygon;
  opts: CommandOptions<Opts>;
  guild: Guild;
  author: GuildMember;
  channel: CommandChannel;
  embed: Embed;
  intr: CommandInteraction;
  cell: Cell;
}

export type CommandFn<Opts = unknown> = BaseCommandFn<CommandFnArgs<Opts>>;
export type Command<Opts = unknown> = BaseCommand<CommandFn<Opts>>;

export type CommandCallFn = BaseCommandCallFn<Command, CommandInteraction>;

export const callCommand: CommandCallFn = (intr, cell, command) => {
  const guild = intr.guild;
  const channel = intr.channel;

  if (!guild) {
    console.log('TODO: handle dm command');
    return;
  }

  if (!isCommandChannel(channel)) {
    return;
  }

  const client = cell.client;
  const author = intr.member as GuildMember;
  const embed = new Embed();
  const opts = new CommandOptions(intr.options);

  const args: CommandFnArgs = {
    client,
    guild,
    channel,
    author,
    embed,
    intr,
    opts,
    cell,
  };

  log(command(args), args);
};

function isCommandChannel(ch: unknown): ch is CommandChannel {
  return !!ch && (ch instanceof TextChannel || ch instanceof ThreadChannel);
}

function log(result: Promise<void>, args: CommandFnArgs) {
  const params = {
    author: args.author.user.username,
    channel: args.channel.name,
    guild: args.guild.name,
    cmd: args.cell.name,
  };

  result
    .then(() => intrLogger.info(lang('ok', params)))
    .catch((error) =>
      catchIntrError(error, args.intr, args.embed, () =>
        intrLogger.error(lang('err', params)),
      ),
    );
}

const lang = createLang(<const>{
  ok: '{author} used /{cmd} in {channel}, {guild}.',
  err: '{author} encountered a crash using /{cmd} in {channel}, {guild}. More details may be above.',
});
