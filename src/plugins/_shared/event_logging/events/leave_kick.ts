import { GuildAuditLogsEntry, GuildMember, PartialGuildMember } from 'discord.js';
import { logger } from 'porygon/logger';
import { EventProxy } from 'porygon/plugin';
import { missedPartialLeaves } from 'porygon/stats';
import { codeBlock } from 'support/string';
import { formatTime } from 'support/time';
import { getKickLog } from '../audit';
import { LogConfig, LogEmbed } from '../config';
import { outputLogs } from '../output_channel';

// same right now, but might change in the future
export type LeavesLogConfig = LogConfig<'joinedAt' | 'userId'>;
export type KicksLogConfig = LogConfig<'joinedAt' | 'userId'>;

export function logLeavesKicks(
  events: EventProxy,
  leaves?: LeavesLogConfig,
  kicks?: KicksLogConfig,
) {
  async function run(member: GuildMember | PartialGuildMember) {
    if (member.partial) {
      const { guild, displayName } = member;
      logger.bug.warn(`A partial member left ${guild.name}: ${displayName}`);

      missedPartialLeaves.fail();
      return;
    }

    missedPartialLeaves.pass();

    const kick = await getKickLog(member);
    return kick ? kicked(member, kick) : left(member);
  }

  function shared(embed: LogEmbed<'joinedAt' | 'userId'>, member: GuildMember) {
    embed
      .detail('joinedAt', (e) => {
        if (member.joinedAt) {
          e.addField('Joined At', formatTime(member.joinedAt));
        }
      })
      .detail('userId', (e) => {
        e.addField('User ID', codeBlock(member.id));
      });
  }

  async function kicked(member: GuildMember, log: GuildAuditLogsEntry) {
    if (!kicks) return;

    const embed = new LogEmbed(kicks.details);
    const mod = log.executor?.username ?? '(unknown)';

    embed
      .base((e) => {
        e.poryColor('danger')
          .setAuthor(member.user, { withDisc: true })
          .setTitle(`${member.user.username} was kicked by ${mod}`)
          .addField('Reason', log.reason ?? '_(no reason given)_');
      })
      .mergeWith(shared, member);

    outputLogs(kicks.to, embed, member.guild);
  }

  function left(member: GuildMember) {
    if (!leaves) return;

    const log = new LogEmbed(leaves.details);

    log
      .base((e) => {
        e.poryColor('warning')
          .setAuthor(member.user, { withDisc: true })
          .setTitle('Member Left');
      })
      .mergeWith(shared, member);

    outputLogs(leaves.to, log, member.guild);
  }

  events.on('guildMemberRemove', run);
}
