import { Message, PartialMessage } from 'discord.js';
import { Embed, fromUser, IntoEmbed } from 'porygon/embed';
import formatWith from 'date-fns/format';
import { HandlerEventProxy } from 'porygon/package';
import { code, codeBlock } from 'support/string';
import { LogOutputChannel, outputLogs } from './output_channel';

interface Opts {
  verbosity: 'simple' | 'verbose';
  logTo: LogOutputChannel;
}

export function logDeletions(events: HandlerEventProxy, opts: Opts) {
  function run(message: Message | PartialMessage) {
    const { author, guild } = message;

    if (!author || !guild) {
      return;
    }

    const verbose: IntoEmbed = (embed: Embed) => {
      if (opts.verbosity === 'verbose') {
        embed
          .addInlineField('Deleted at', format(new Date()))
          .addField('Message ID', codeBlock(message.id))
          .addField('User ID', codeBlock(author.id));
      }
    };

    const embed = new Embed()
      .poryColor('info')
      .setAuthor(...fromUser(author))
      .setTitle('Message Deleted')
      .setDescription(message.content ?? '*(no content)*')
      .addInlineField('Channel', message.channel.toString())
      .addInlineField('Sent at', format(message.createdAt))
      .merge(verbose);

    outputLogs(opts.logTo, embed, guild);
  }

  events.on('messageDelete', run);
}

function format(date: Date) {
  return formatWith(date, code('hh:mm:ss b'));
}
