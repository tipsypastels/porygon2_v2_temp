import {
  ChatInputApplicationCommandData as Data,
  CommandInteraction as Intr,
  GuildMember,
} from 'discord.js';
import { Embed } from 'porygon/embed';
import { onDMCommand } from 'porygon/interaction/dm';
import { logger } from 'porygon/logger';
import { TimeDifferenceStat } from 'porygon/stats';
import { noop } from 'support/fn';
import { Seconds } from 'support/time';
import { BaseArgs, BaseCommand, BaseCommandFn, Executor } from '../base';
import { CommandResultLogger } from '../middleware/result_logger';
import { CommandChannel, isCommandChannel } from './channel';
import { CommandOptions } from './options';

interface Args<O> extends BaseArgs<Intr> {
  channel: CommandChannel;
  opts: CommandOptions<O>;
}

export type CommandFn<O = unknown> = BaseCommandFn<ToAmbience<O>>;
export type Command<O = unknown> = BaseCommand<ToAmbience<O>, Data>;

type ToAmbience<O> = { Args: Args<O>; Intr: Intr };

export class CommandExecutor<O> extends Executor<ToAmbience<O>> {
  readonly middleware = [Logger, SlowTiming];

  protected getArgs(): Args<O> | undefined {
    const { cell, intr, client } = this;
    const { guild, channel, member: author } = intr;

    if (!guild) {
      onDMCommand(client, intr).catch(noop);
      return;
    }

    if (!isCommandChannel(channel) || !(author instanceof GuildMember)) {
      return;
    }

    const embed = new Embed();
    const opts = new CommandOptions<O>(intr.options);

    return {
      client,
      author,
      guild,
      cell,
      intr,
      channel,
      embed,
      opts,
    };
  }
}

class Logger extends CommandResultLogger<ToAmbience<any>> {
  protected getCommandName() {
    return `/${this.exec.command.data.name}`;
  }

  protected override getCommandOptions() {
    return this.args.opts.getSerializedOptionsString();
  }

  protected override getLocation() {
    return `${this.args.channel.name}, ${this.args.guild.name}`;
  }
}

class SlowTiming<M extends ToAmbience<any>> {
  private time = new TimeDifferenceStat();

  constructor(protected exec: Executor<M>, protected args: M['Args']) {}

  async before() {
    this.time.startTiming();
  }

  async after() {
    const difference = this.time.difference;

    if (difference > Seconds(2)) {
      const seconds = Math.ceil(difference / 1000);
      logger.intr.warn(`Command %/${this.exec.cell.name}% took %${seconds}s% to finish!`);
    }
  }
}
