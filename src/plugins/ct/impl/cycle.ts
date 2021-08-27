import { db } from 'porygon/core';
import { logger } from 'porygon/logger';
import { CtConfig } from './shared';

export async function ctRunCycle() {
  if (!CtConfig.enabled) {
    return;
  }

  await db.$executeRaw`
      UPDATE 
        "public"."PlugCt_Score"
      SET 
        "pointsLastCycle" = "pointsThisCycle",
        "pointsThisCycle" = 0 
    `;

  logger.ct.info('COOLTRAINER has been cycled!');
}
