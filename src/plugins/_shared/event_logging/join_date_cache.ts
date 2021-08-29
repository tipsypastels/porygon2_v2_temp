import { PlugPokecom_JoinDateCache } from '.prisma/client';
import { Guild, GuildMember, Snowflake } from 'discord.js';
import { noop } from 'lodash';
import { eachMemberBatch } from 'plugins/_shared/each_member';
import { db, Porygon } from 'porygon/core';
import { createLang } from 'porygon/lang';
import { logger } from 'porygon/logger';
import { CounterStat } from 'porygon/stats';

const TABLE = db.plugPokecom_JoinDateCache;

export const joinDateSource = CounterStat.table(['missing', 'member', 'database']);

export async function cacheJoinDateForMembers(guild: Guild) {
  let newInserts = 0;

  const counters = await eachMemberBatch(guild, async (members, batch) => {
    const data: PlugPokecom_JoinDateCache[] = [];

    for (const [, member] of members) {
      if (member.joinedAt) {
        data.push({ joinedAt: member.joinedAt, userId: member.id });
      }
    }

    await TABLE.createMany({ data, skipDuplicates: true })
      .then(({ count }) => (newInserts += count))
      .catch((error) => logger.bug.error(lang('batchError', { batch, error })));
  });

  return { ...counters, newInserts };
}

// this function is useful because porygon doesn't catch members who leave
// while it's offline, so we'll eventually get buildup of unused data over time
export function clearAndReloadAllJoinDates(guild: Guild) {
  return TABLE.deleteMany().then(() => cacheJoinDateForMembers(guild));
}

export async function cacheJoinDate({ id: userId, user, joinedAt }: GuildMember) {
  if (joinedAt) {
    upsert(userId, joinedAt).catch((error) => {
      logger.bug.error(lang('cacheError', { user: user.username, error }));
    });
  } else {
    logger.bug.warn(lang('cacheNone', { user: user.username }));
  }
}

async function upsert(userId: Snowflake, joinedAt: Date) {
  const where = { userId };
  const update = { joinedAt };
  const create = { joinedAt, userId };
  return await TABLE.upsert({ where, update, create });
}

export function uncacheJoinDate({ id: userId }: { id: Snowflake }) {
  TABLE.delete({ where: { userId } })
    .then(noop) // TODO: why is this needed?? prisma ignores promises without it :/
    .catch((error) => {
      logger.bug.error(lang('uncacheError', { userId, error }));
    });
}

export function getJoinDateFromCache(userId: Snowflake) {
  return TABLE.findFirst({ where: { userId } }).then((x) => x?.joinedAt);
}

// exported cross-plugin, used by /op stats
export async function getJoinDateStatsString() {
  const count = await TABLE.count();
  const params = { ...joinDateSource, count };
  return lang('embed', params);
}

const lang = createLang(<const>{
  batchError: 'Failed to cache join dates for %batch {batch}%: {error}',
  cacheError: 'Failed to cache join date for %{user}%: {error}',
  cacheNone: 'Could not cache join date for %{user}%, no join date provided.',
  uncacheError: 'Failed to uncache join date for user with ID: %{userId}%: {error}',
  embed: '**Sources:** `😇 {member} 💽 {database} ❓ {missing}`\n**Table size**: {count}',
});
