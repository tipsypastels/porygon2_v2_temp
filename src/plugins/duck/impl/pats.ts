import { PlugDuck_PatCount } from '@prisma/client';
import { Guild, GuildMember, Snowflake } from 'discord.js';
import { HEADPAT_ASSETS } from 'porygon/assets';
import { db } from 'porygon/core';

export function getPatGif() {
  return HEADPAT_ASSETS.random().url;
}

export async function incrementPatCount({ id }: GuildMember, by = 1) {
  await db.$executeRaw`
    INSERT INTO
      "public"."PlugDuck_PatCount" ("userId", "pats")
    VALUES
      (${id}, ${by})
    ON CONFLICT ON CONSTRAINT
      "PlugDuck_PatCount_pkey"
    DO UPDATE
    SET pats = (
      "PlugDuck_PatCount"."pats" + "excluded"."pats"
    )
  `;
}

export async function* patLeaderboard(guild: Guild) {
  const entries = await fetchLeaderboard();
  const memberPromises = entries.map(({ userId }) =>
    guild.members.fetch(userId as Snowflake).catch(() => null),
  );

  const members = await Promise.all(memberPromises);

  for (let i = 0; i < entries.length; i++) {
    const member = members[i];
    const pats = entries[i].pats;

    if (member && pats) {
      yield { member, pats };
    }
  }
}

function fetchLeaderboard() {
  return db.$queryRaw<PlugDuck_PatCount[]>`
    SELECT
      "userId",
      "pats"
    FROM
      "public"."PlugDuck_PatCount"
    ORDER BY
      "pats" DESC
    LIMIT
      10
  `;
}
