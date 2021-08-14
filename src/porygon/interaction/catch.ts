import { BaseCommandInteraction } from 'discord.js';
import { Embed } from 'porygon/embed';
import { isEmbeddedError } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { codeBlock } from 'support/string';
import { intrLogger } from './logger';

// Using a tuple here so it's less messy to call in a promise chain.
type Args = [unknown, BaseCommandInteraction, Embed, () => void];

export function catchIntrError(...[error, intr, embed, log]: Args) {
  let logAfter = true;
  let ephemeral = false;

  if (isEmbeddedError(error)) {
    embed.merge(error);

    logAfter = false;
    ephemeral = error.ephemeral;
  } else if (error instanceof Error) {
    embed
      .poryColor('error')
      .poryThumb('error')
      .setTitle(lang('err'))
      .setDescription(codeBlock(clean(error.message)));

    intrLogger.error(error);
  } else {
    embed.poryColor('error').poryThumb('error').setTitle('unk');
    intrLogger.error(error as any); // better than nothing
  }

  intr.reply({ embeds: [embed], ephemeral });
  logAfter && log();
}

export function clean(message: string) {
  return message
    .replace(process.env.TOKEN!, '<filtered>')
    .replace(process.env.DATABASE_URL!, '<filtered>');
}

const lang = createLang(<const>{
  err: "Whoops, that's an error.",
  unk: 'An unknown error occurred.',
});
