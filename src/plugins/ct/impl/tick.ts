import { Prisma } from '@prisma/client';
import { Guild, GuildMember, Snowflake } from 'discord.js';
import { db } from 'porygon/core';
import { bugLogger } from 'porygon/logger';
import { CtConfig, ctLogger } from './shared';

type Where = 'above' | 'below';
type Each = (member: GuildMember) => void;

interface Entry {
  userId: Snowflake;
}

export async function ctRunTick(guild: Guild) {
  if (!CtConfig.enabled) {
    return;
  }

  const role = await guild.roles.fetch(CtConfig.roleId);

  if (!role) {
    return bugLogger.error('Cooltrainer role not found. Aborting tick.');
  }

  const has = (member: GuildMember) => {
    return member.roles.cache.has(role.id);
  };

  const give = () => {
    return eachMember('above', async (member) => {
      if (has(member)) return;
      await member.roles.add(role);

      log(member, 'earned');
    });
  };

  const take = () => {
    return eachMember('below', async (member) => {
      if (!has(member)) return;
      await member.roles.remove(role);

      log(member, 'lost');
    });
  };

  async function eachMember(where: Where, each: Each) {
    const entries = await query(where);
    const promises = entries.map(async ({ userId }) => {
      const member = await toMember(userId);

      if (member) {
        await each(member);
      }
    });

    await Promise.all(promises);
  }

  function toMember(userId: Snowflake) {
    return guild.members.fetch(userId).catch(() => null);
  }

  await Promise.all([give(), take()]);
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
  ctLogger.info(`${member.user.username} ${action} COOLTRAINER.`);
}
