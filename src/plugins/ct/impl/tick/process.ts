import { Prisma } from '.prisma/client';
import { Guild, GuildMember, Snowflake } from 'discord.js';
import { db } from 'porygon/core';
import { logger } from 'porygon/logger';
import { CtConfig } from '../shared';
import { CtTickProviderLike } from './provider';

type Where = 'above' | 'below';
type Each = (member: GuildMember) => void;

// this exists because task arguments are provided up front, which would result
// in the stats from all runs being shared. instead, just pass an array
type ToProvider = () => CtTickProviderLike;

interface Entry {
  userId: Snowflake;
}

export async function ctRunTick(guild: Guild, toProvider: ToProvider) {
  const provider = toProvider();
  const role = await guild.roles.fetch(CtConfig.roleId);

  if (!role) {
    throw new Error('COOLTRAINER role not found. Aborting tick.');
  }

  const has = (member: GuildMember) => {
    return member.roles.cache.has(role.id);
  };

  const give = () => {
    return eachMember('above', async (member) => {
      if (has(member)) return;
      await provider.add(member, role);

      log(member, 'earned');
    });
  };

  const take = () => {
    return eachMember('below', async (member) => {
      if (!has(member)) return;
      await provider.remove(member, role);

      log(member, 'lost');
    });
  };

  async function eachMember(where: Where, each: Each) {
    const entries = await query(where);
    const promises = entries.map(async ({ userId }) => {
      const member = await toMember(userId);

      if (member) {
        await each(member);
      } else {
        provider.trash(userId);
      }
    });

    await Promise.all(promises);
  }

  function toMember(userId: Snowflake) {
    return guild.members.fetch(userId).catch(() => null);
  }

  await Promise.all([give(), take()]);

  logger.ct.info('Trashing old COOLTRAINER rows...');

  await provider.clearTrash();

  if (provider.trashed.length > 0) {
    logger.ct.info(`Trashed entries: %${provider.trashed}%.`);
  }

  const stats = provider.toJSON();

  return stats;
}

function query(where: Where) {
  const op = where === 'above' ? '>' : '<';
  const threshold = CtConfig.threshold;

  return db.$queryRaw<Entry[]>`
      SELECT 
        "userId"
      FROM
        "public"."PlugCt_Score"
      WHERE
        "pointsThisCycle" + "pointsLastCycle" ${Prisma.raw(op)} ${threshold}
    `;
}

function log(member: GuildMember, action: string) {
  logger.ct.info(`${member.user.username} ${action} COOLTRAINER.`);
}
