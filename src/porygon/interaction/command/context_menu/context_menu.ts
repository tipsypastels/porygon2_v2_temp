import { GuildMember, Message, ContextMenuInteraction as Intr } from 'discord.js';
import { Embed } from 'porygon/embed';
import { createLang } from 'porygon/lang';
import { logger } from 'porygon/logger';
import { BaseArgs, Executor, BaseCommandFn, BaseCommand } from '../base';

interface MsgArgs extends BaseArgs<Intr> {
  message: Message;
}

interface UserArgs extends BaseArgs<Intr> {
  member: GuildMember;
}

export type UserContextMenuFn = BaseCommandFn<ToAmbience<UserArgs>>;
export type UserContextMenu = BaseCommand<ToAmbience<UserArgs>>;

export type MsgContextMenuFn = BaseCommandFn<ToAmbience<MsgArgs>>;
export type MsgContextMenu = BaseCommand<ToAmbience<MsgArgs>>;

export type ContextMenuFn = BaseCommandFn<Ambience>;
export type ContextMenu = BaseCommand<Ambience>;

type Args = BaseArgs<Intr> & Partial<MsgArgs & UserArgs>;

type ToAmbience<A> = { Intr: Intr; Args: A };
type Ambience = ToAmbience<Args>;

export class ContextMenuExecutor extends Executor<Ambience> {
  // TODO: once you actually make any of these
  readonly middleware = [];

  protected getArgs(): Args | undefined {
    const { cell, intr, client } = this;
    const { guild, member: author } = intr;

    if (!guild || !(author instanceof GuildMember)) {
      return;
    }

    const embed = new Embed();

    return merge({
      client,
      guild,
      author,
      embed,
      intr,
      cell,
    });
  }
}

function merge(args: Args) {
  if (args.intr.targetType === 'MESSAGE') {
    const message = args.intr.options.getMessage('message');

    if (!(message instanceof Message)) {
      logger.bug.warn(lang('wrongType', { type: 'message' }));
      return;
    }

    return { ...args, message };
  }

  const member = args.intr.options.getMember('user');

  if (!(member instanceof GuildMember)) {
    logger.bug.warn(lang('wrongType', { type: 'user' }));
    return;
  }

  return { ...args, member };
}

const lang = createLang(<const>{
  wrongType: 'Got mismatched types for context menu (expected %{type}%). Skipping...',
});
