import { Guild } from 'discord.js';
import { db } from 'porygon/core';
import { ctLogger } from './shared';
import { ctRunTick } from './tick';

export async function ctRunCycle(guild: Guild) {
  await db.$executeRaw`
      UPDATE 
        "public"."PkgCt_Score"
      SET 
        "pointsLastCycle" = "pointsThisCycle",
        "pointsThisCycle" = 0 
    `;

  ctLogger.info('COOLTRAINER has been cycled! Running a tick now...');

  await ctRunTick(guild);
}
