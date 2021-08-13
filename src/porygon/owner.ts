import { Snowflake } from 'discord.js';
import { resolveSnowflake, SnowflakeLike } from 'support/snowflake';
import { Porygon } from './core';

const OWNER = process.env.OWNER as Snowflake;

export function isOwner(user: SnowflakeLike) {
  return resolveSnowflake(user) === OWNER;
}

export function assertOwner(user: SnowflakeLike) {
  if (!isOwner(user)) {
    throw new Error('This functionality can only be used by the bot owner.');
  }
}

export function findOwner(client: Porygon) {
  return client.users.cache.get(OWNER);
}
