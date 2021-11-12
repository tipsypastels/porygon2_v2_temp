import { Embed } from 'porygon/embed';
import { BuiltinError, isBuiltinError } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { logger } from 'porygon/logger';
import { codeBlock } from 'support/string';
import { Ambience, Executor, Outcome } from '../base';

export abstract class CommandResultLogger<M extends Ambience> {
  constructor(protected exec: Executor<M>, protected args: M['Args']) {}

  protected abstract getCommandName(): string;

  protected getCommandOptions() {
    return '';
  }

  protected getLocation() {
    return this.args.guild.name;
  }

  async after(outcome: Outcome) {
    if (!outcome.ok) {
      await this.logErr(outcome.error);
    } else {
      this.logOk();
    }
  }

  private logOk() {
    logger.intr.info(lang('log.ok', this.params));
  }

  private logErr(err: any) {
    const fn = isBuiltinError(err) ? 'logBuiltinErr' : 'logUnknownError';
    const handle = this[fn](err);

    return handle.catch(() => {
      logger.intr.error(lang('log.handlerErr'));
    });
  }

  private logBuiltinErr(err: BuiltinError) {
    const { name } = this.exec.cell;
    const params = { ...this.params, codeDomain: name, code: err.code };

    logger.intr.warn(lang('log.builtinErr', params));

    const { ephemeral } = err;
    const embed = new Embed().mergeWith(err, name);

    return this.reply(embed, ephemeral);
  }

  private logUnknownError(err: any) {
    logger.intr.error(lang('log.unkErr', this.params));
    logger.intr.error(err);

    const ephemeral = this.exec.command.unknownErrorEphemerality?.(this.args) ?? true;
    const embed = new Embed()
      .poryErr('error')
      .setTitle(lang('embed.unk.title'))
      .setDesc(errorMessage(err));

    return this.reply(embed, ephemeral);
  }

  private get params() {
    const name = this.getCommandName();
    const rest = this.getCommandOptions();
    const cmd = rest ? `${name} ${rest}` : name;

    const loc = this.getLocation();
    const author = this.args.author.user.username;

    return { loc, cmd, author };
  }

  private reply(embed: Embed, ephemeral: boolean) {
    return this.exec.intr.reply({ embeds: [embed], ephemeral });
  }
}

function errorMessage(error: any) {
  if (error instanceof Error) {
    return codeBlock(
      error.message
        .replace(process.env.TOKEN!, '<filtered>')
        .replace(process.env.DATABASE_URL!, '<filtered>'),
    );
  }

  return lang('embed.unk.noMsg');
}

const lang = createLang(<const>{
  log: {
    ok: '{author} used %{cmd}% in {loc}.',
    builtinErr:
      '{author} misused %{cmd}% in {loc} and encountered error: %{codeDomain}.{code}%.',
    unkErr: '{author} encountered a crash using %{cmd}% in {loc}.',
    handlerErr: 'The above error could not be reported via interaction.',
  },
  embed: {
    unk: {
      title: 'Welp. The command crashed.',
      noMsg: 'No error message could be provided.',
      code: 'Error Code: unknown',
    },
  },
});
