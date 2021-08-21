import { GuildMember } from 'discord.js';
import { EventProxy } from 'porygon/plugin';
import { codeBlock } from 'support/string';
import { timeAgoInWords } from 'support/time';
import { LogConfig, LogEmbed } from '../config';
import { outputLogs } from '../output_channel';

export type JoinsLogConfig = LogConfig<'age' | 'userId'>;

export function logJoins(events: EventProxy, cfg: JoinsLogConfig) {
  function run(member: GuildMember) {
    const embed = new LogEmbed(cfg.details);

    embed
      .base((e) => {
        e.poryColor('info')
          .setAuthor(member.user, { withDisc: true })
          .setTitle('Member Joined');
      })
      .detail('age', (e) => {
        e.addField('Account Age', timeAgoInWords(member.user.createdAt));
      })
      .detail('userId', (e) => {
        e.addField('User ID', codeBlock(member.id));
      });

    outputLogs(cfg.to, embed, member.guild);
  }

  events.on('guildMemberAdd', run);
}
