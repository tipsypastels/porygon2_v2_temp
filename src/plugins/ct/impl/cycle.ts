import { db } from 'porygon/core';
import { ctLogger } from './shared';

export async function ctRunCycle() {
  await db.$executeRaw`
      UPDATE 
        "public"."PlugCt_Score"
      SET 
        "pointsLastCycle" = "pointsThisCycle",
        "pointsThisCycle" = 0 
    `;

  ctLogger.info('COOLTRAINER has been cycled!');
}
