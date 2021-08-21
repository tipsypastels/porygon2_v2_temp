import { GuildBan, User } from 'discord.js';
import { EventProxy } from 'porygon/plugin';
import { codeBlock } from 'support/string';
import { getBanLog, getUnbanLog } from '../audit';
import { LogConfig, LogEmbed } from '../config';
import { outputLogs } from '../output_channel';

// same right now, but might change in the future
export type BansLogConfig = LogConfig<'userId'>;
export type UnbansLogConfig = LogConfig<'userId'>;

// lang is overkill
const UNKNOWN = '(unknown)';

export function logBans(events: EventProxy, cfg: BansLogConfig) {
  async function run(ban: GuildBan) {
    const log = await getBanLog(ban);
    const mod = log?.executor?.username ?? UNKNOWN;

    // in theory these should be the same, but the discord API is nothing
    // if not consistently inconsistent. so it's always good to have backups
    const reason = log?.reason ?? ban.reason;

    const { user, guild } = ban;
    const embed = new LogEmbed(cfg.details);

    embed
      .base((e) => {
        e.poryColor('error')
          .setAuthor(user, { withDisc: true })
          .setTitle(`${user.username} was banned by ${mod}`)
          .addField('Reason', reason ?? '_(no reason given)_');
      })
      .mergeWith(shared, user);

    outputLogs(cfg.to, embed, guild);
  }

  events.on('guildBanAdd', run);
}

export function logUnbans(events: EventProxy, cfg: BansLogConfig) {
  async function run(ban: GuildBan) {
    const log = await getUnbanLog(ban);
    const mod = log?.executor?.username ?? UNKNOWN;

    const { user, guild } = ban;
    const embed = new LogEmbed(cfg.details);

    embed
      .base((e) => {
        e.poryColor('ok')
          .setAuthor(user, { withDisc: true })
          .setTitle(`${user.username} was unbanned by ${mod}`);
      })
      .mergeWith(shared, user);

    outputLogs(cfg.to, embed, guild);
  }

  events.on('guildBanRemove', run);
}

function shared(embed: LogEmbed<'userId'>, user: User) {
  embed.detail('userId', (e) => {
    e.addField('User ID', codeBlock(user.id));
  });
}
