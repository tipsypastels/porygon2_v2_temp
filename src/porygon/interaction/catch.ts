import { BaseCommandInteraction as Intr } from 'discord.js';
import { Embed } from 'porygon/embed';
import { isEmbeddedError } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { intrLogger } from './logger';

export function catchIntrError(error: unknown, intr: Intr, log: () => void) {
  // it's not safe to pass in the embed from the interaction handler,
  // as it may have stale data that caused the error in the first place.
  // https://discord.com/channels/322199235825238017/387508516262510612/876751386073767947
  // thanks wobb!
  const embed = new Embed();

  let logAfter = true;
  let ephemeral = false;

  if (isEmbeddedError(error)) {
    embed.merge(error);

    logAfter = false;
    ephemeral = error.ephemeral;
  } else if (error instanceof Error) {
    console.log('caugth err');
    embed.poryColor('error').poryThumb('error').setTitle(lang('err'));
    // .setDescription(codeBlock(clean(error.message)));

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
