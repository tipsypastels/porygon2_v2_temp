import { Guild, Snowflake } from 'discord.js';
import { db } from 'porygon/core';

interface Entry {
  userId: Snowflake;
  score: number;
}

export async function* ctCreateScoreboard(guild: Guild) {
  function toMember({ userId }: Entry) {
    return guild.members.fetch(userId).catch(() => null);
  }

  const entries = await fetch();
  const members = await Promise.all(entries.map(toMember));

  for (let i = 0; i < entries.length; i++) {
    const member = members[i];
    const score = entries[i].score;

    if (member && score) {
      yield { member, score };
    }
  }
}

function fetch() {
  return db.$queryRaw<Entry[]>`
    SELECT
      "userId",
      "pointsLastCycle" + "pointsThisCycle" as "score"
    FROM
      "public"."PkgCt_Score"
    ORDER BY
      "score" DESC
    LIMIT
      10
  `;
}
