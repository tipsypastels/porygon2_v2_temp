import { Guild, GuildMember, Snowflake } from 'discord.js';
import { eachMember } from 'plugins/_shared/each_member';
import { db } from 'porygon/core';
import { bugLogger } from 'porygon/logger';

const TABLE = db.plugPokecom_JoinDateCache;

export function cacheJoinDateForMembers(guild: Guild) {
  return eachMember(guild, cacheJoinDate);
}

export async function cacheJoinDate({ id: userId, user, joinedAt }: GuildMember) {
  if (joinedAt) {
    await TABLE.upsert({
      where: { userId },
      update: { joinedAt },
      create: { userId, joinedAt },
    })
      .then(() => console.log(`Cached ${user.username}`))
      .catch((error) => {
        bugLogger.error(`Failed to cache join date for ${user.username}: ${error}`);
      });
  }
}

export function uncacheJoinDate(userId: Snowflake) {
  TABLE.delete({ where: { userId } }).catch((error) => {
    bugLogger.error(`Failed to uncache join date for user with ID: ${userId}: ${error}`);
  });
}

export function getJoinDateFromCache(userId: Snowflake) {
  return TABLE.findFirst({ where: { userId } }).then((x) => x?.joinedAt);
}
