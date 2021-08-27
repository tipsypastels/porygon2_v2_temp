import { Guild, Snowflake } from 'discord.js';
import { logger } from 'porygon/logger';
import { LogEmbed } from './config';

export type LogOutputChannel =
  | Snowflake
  | Snowflake[]
  | { value: Snowflake }
  | { value: Snowflake }[];

export function outputLogs(ch: LogOutputChannel, embed: LogEmbed<any>, guild: Guild) {
  const channelIds = resolve(ch);
  const promises = channelIds.map(async (id) => {
    const channel = await guild.channels.fetch(id);

    // All the channel IDs we get here are from config, so treat
    // type errors as a bug rather than user error.
    if (!channel) {
      logger.bug.error(`Tried to log to nonexistant channel ${id}`);
      return;
    }

    if (!channel.isText()) {
      logger.bug.error(`Tried to log to non-text channel ${id}.`);
      return;
    }

    channel.send({ embeds: [embed.toEmbed()] });
  });

  return Promise.all(promises);
}

function resolve(ch: LogOutputChannel): Snowflake[] {
  return Array.isArray(ch) ? ch.map(resolveSingle) : [resolveSingle(ch)];
}

function resolveSingle(ch: Exclude<LogOutputChannel, any[]>): Snowflake {
  return typeof ch === 'string' ? ch : ch.value;
}
