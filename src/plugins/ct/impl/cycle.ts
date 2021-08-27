import { db } from 'porygon/core';
import { logger } from 'porygon/logger';

export async function ctRunCycle() {
  await db.$executeRaw`
      UPDATE 
        "public"."PlugCt_Score"
      SET 
        "pointsLastCycle" = "pointsThisCycle",
        "pointsThisCycle" = 0 
    `;

  logger.ct.info('COOLTRAINER has been cycled!');
}
