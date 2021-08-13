import { BaseCommandInteraction } from 'discord.js';
import { Embed } from 'porygon/embed';
import { isEmbeddedError } from 'porygon/error';
import { filterErrorMessage } from 'support/error_filter';
import { codeBlock } from 'support/string';
import { intrLogger } from './logger';

enum After {
  Ignore,
  Log,
}

// Using a tuple here so it's less messy to call in a promise chain.
type Args = [unknown, BaseCommandInteraction, Embed, () => void];

export function catchIntrError(...[error, intr, embed, log]: Args) {
  const after = respond(error, embed);

  intr.reply({ embeds: [embed] });
  after === After.Log && log();
}

function respond(error: unknown, embed: Embed) {
  if (isEmbeddedError(error)) {
    embed.merge(error);
    return After.Ignore;
  }

  if (error instanceof Error) {
    embed
      .poryColor('error')
      .poryThumb('error')
      .setTitle("Whoops, that's an error.")
      .setDescription(codeBlock(filterErrorMessage(error.message)));

    intrLogger.error(error);
    return After.Log;
  }

  embed.poryColor('error').poryThumb('error').setTitle('An unknown error occurred.');
  intrLogger.error(error as any); // better than nothing /shrug

  return After.Log;
}
