import { Embed } from 'porygon/embed';
import { BuiltinError, isBuiltinError } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { logger } from 'porygon/logger';
import { codeBlock } from 'support/string';
import { CreateBaseCommand } from './types';

// TODO: Figure out how to type these properly.
// You'd think <BaseCommandArgs, BaseCommandInteraction> but for some reason
// it wants those to be assignable to the *implementing* types which have more
// properties. Possibly just an inference failure for this kind of factory type?
// It's annoying.
type Create = CreateBaseCommand<any, any>;

interface Opts<C extends Create> {
  createArgs(...call: C['CallFnArgs']): C['Args'] | undefined;
  getLoggerCommandName(command: C['Command']): string;
  getLoggerCommandOptions?(args: C['Args']): string;
  getLoggerLocationContext?(args: C['Args']): string;
}

export function createBaseCommandCall<C extends Create>(opts: Opts<C>): C['CallFn'] {
  function defaultLocationContext(args: C['Args']) {
    return args.guild.name;
  }

  function getLocationContext(args: C['Args']) {
    return (opts.getLoggerLocationContext ?? defaultLocationContext)(args);
  }

  function getFullCommandString(command: C['Command'], args: C['Args']) {
    const name = opts.getLoggerCommandName(command);
    const rest = opts.getLoggerCommandOptions?.(args);
    return rest ? `${name} ${rest}` : name;
  }

  function getLoggerBaseParams(command: C['Command'], args: C['Args']) {
    const loc = getLocationContext(args);
    const cmd = getFullCommandString(command, args);
    const author = args.author.user.username;
    return { loc, cmd, author };
  }

  function getUnknownErrorEphemerality(command: C['Command'], args: C['Args']) {
    return command.unknownErrorEphemerality?.(args) ?? false;
  }

  function onSuccess(command: C['Command'], args: C['Args']) {
    logger.intr.info(lang('log.ok', getLoggerBaseParams(command, args)));
  }

  function onError(err: any, command: C['Command'], args: C['Args']) {
    return isBuiltinError(err)
      ? onBuiltinError(err, command, args)
      : onUnknownErr(err, command, args);
  }

  function onBuiltinError(err: BuiltinError, command: C['Command'], args: C['Args']) {
    const embed = new Embed().mergeWith(err, command.data.name);
    args.intr.reply({ embeds: [embed], ephemeral: err.ephemeral });

    const params = {
      ...getLoggerBaseParams(command, args),
      codeDomain: command.data.name,
      code: err.code,
    };

    logger.intr.warn(lang('log.builtinErr', params));
  }

  function onUnknownErr(err: unknown, command: C['Command'], args: C['Args']) {
    const ephemeral = getUnknownErrorEphemerality(command, args);
    const embed = new Embed()
      .poryErr('error')
      .setTitle(lang('embed.unk.title'))
      .setDescription(getErrorMsg(err));

    args.intr.reply({ embeds: [embed], ephemeral });

    logger.intr.error(lang('log.unkErr', getLoggerBaseParams(command, args)));
    logger.intr.error(err as any);
  }

  return async function (intr, cell, command) {
    const args = opts.createArgs(intr, cell, command);

    if (!args) {
      return;
    }

    try {
      await command(args);
      onSuccess(command, args);
    } catch (error: unknown) {
      onError(error, command, args);
    }
  };
}

function getErrorMsg(err: unknown) {
  return err instanceof Error
    ? codeBlock(cleanError(err.message))
    : lang('embed.unk.noMsg');
}

function cleanError(message: string) {
  return message
    .replace(process.env.TOKEN!, '<filtered>')
    .replace(process.env.DATABASE_URL!, '<filtered>');
}

const lang = createLang(<const>{
  log: {
    ok: '{author} used "{cmd}" in {loc}.',
    builtinErr:
      '{author} misused "{cmd}" in {loc} and encountered error: {codeDomain}.{code}.',
    unkErr: '{author} encountered a crash using "{cmd}" in {loc}. More details follow.',
  },
  embed: {
    unk: {
      title: 'Welp. The command crashed.',
      noMsg: 'No error message could be provided.',
      code: 'Error Code: unknown',
    },
  },
});
