import { Snowflake } from 'discord.js';
import { config } from './config';

const GUILDS = config('guilds');

export function getConfigNameForGuild(guildId: Snowflake) {
  return Object.entries(GUILDS.value).find(([, id]) => id === guildId)?.[0] ?? 'unknown';
}
