import { db } from 'porygon/core';
import { CtConfig, ctLogger } from './shared';

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

  ctLogger.info('COOLTRAINER has been cycled!');
}
