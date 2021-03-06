import { Message, PartialMessage } from 'discord.js';
import { EventProxy } from 'porygon/plugin';
import { codeBlock } from 'support/string';
import { formatEventTime } from 'support/time';
import { LogConfig, LogEmbed } from '../config';
import { outputLogs } from '../output_channel';

export type DeletionsLogConfig = LogConfig<'channel' | 'sentAt' | 'msgId' | 'userId'>;

export function logDeletions(events: EventProxy, cfg: DeletionsLogConfig) {
  function run(message: Message | PartialMessage) {
    const { author, guild } = message;

    if (!author || author.bot || !guild) {
      return;
    }

    const embed = new LogEmbed(cfg.details);

    embed
      .base((e) => {
        e.poryColor('info')
          .setAuthor(author, { withDisc: true })
          .setTitle('Message Deleted')
          .setDescription(message.content || '_(no content)_');
      })
      .detail('channel', (e) => {
        e.addInlineField('Channel', message.channel.toString());
      })
      .detail('sentAt', (e) => {
        e.addInlineField('Sent At', formatEventTime(message.createdAt));
      })
      .detail('msgId', (e) => {
        e.addField('Message ID', codeBlock(message.id));
      })
      .detail('userId', (e) => {
        e.addField('User ID', codeBlock(author.id));
      });

    outputLogs(cfg.to, embed, guild);
  }

  events.on('messageDelete', run);
}
