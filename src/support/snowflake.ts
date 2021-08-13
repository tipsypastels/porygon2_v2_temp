import { Snowflake } from 'discord.js';

/**
 * A value that either is a snowflake, or has an `id` property of type `Snowflake`.
 */
export type SnowflakeLike = Snowflake | { id: Snowflake };

/** @see SnowflakeLike */
export function resolveSnowflake(like: SnowflakeLike): Snowflake {
  return typeof like === 'string' ? like : like.id;
}
