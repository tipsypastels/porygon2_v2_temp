import {
  Guild,
  GuildAuditLogsEntry,
  GuildMember,
  PartialGuildMember,
  Snowflake,
  User,
} from 'discord.js';
import { logger } from 'porygon/logger';
import { EventProxy } from 'porygon/plugin';
import { Nullish } from 'support/object';
import { codeBlock } from 'support/string';
import { formatTime } from 'support/time';
import { getKickLog } from '../audit';
import { joinDateSource } from '../join_date_cache';
import { LogConfig, LogConfigFallbackJoinDate, LogEmbed } from '../config';
import { outputLogs } from '../output_channel';

// same right now, but might change in the future
export type LeavesLogConfig = LogConfig<'joinedAt' | 'userId'>;
export type KicksLogConfig = LogConfig<'joinedAt' | 'userId'>;

type Memberlike = { id: Snowflake; user: User; guild: Guild; joinedAt: Date | Nullish };
type TryMemberlike = Promise<Memberlike | undefined>;

export function logLeavesKicks(
  events: EventProxy,
  leaves?: LeavesLogConfig,
  kicks?: KicksLogConfig,
  jdFallback?: LogConfigFallbackJoinDate,
) {
  async function run(member: GuildMember | PartialGuildMember) {
    const memberlike = await resolve(member);
    if (!memberlike) {
      logger.bug.warn(`Failed to find user data for leaving member %${member.id}%.`);
      return;
    }

    const kick = await getKickLog(memberlike);
    return kick ? kicked(memberlike, kick) : left(memberlike);
  }

  async function resolve(member: GuildMember | PartialGuildMember): TryMemberlike {
    const { id, guild, client } = member;

    if (member.partial) {
      const [user, joinedAt] = await Promise.all([
        client.users.fetch(id).catch(() => undefined),
        jdFallback?.(id),
      ]);

      if (!user) return;

      incrementJdStat(joinedAt ? 'database' : 'missing');
      return { id, guild, user, joinedAt };
    }

    incrementJdStat('member');
    return member;
  }

  function incrementJdStat(stat: 'member' | 'database' | 'missing') {
    // only increment stats if we got this function, otherwise it doesn't matter
    if (jdFallback) {
      joinDateSource[stat].increment();
    }
  }

  function shared(embed: LogEmbed<'joinedAt' | 'userId'>, member: Memberlike) {
    embed
      .detail('joinedAt', (e) => {
        const { joinedAt } = member;
        e.addField('Joined At', joinedAt ? formatTime(joinedAt) : 'Unknown');
      })
      .detail('userId', (e) => {
        e.addField('User ID', codeBlock(member.id));
      });
  }

  async function kicked(member: Memberlike, log: GuildAuditLogsEntry) {
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

  function left(member: Memberlike) {
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
