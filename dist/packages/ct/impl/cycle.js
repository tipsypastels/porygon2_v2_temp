"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctRunCycle = void 0;
const core_1 = require("porygon/core");
const shared_1 = require("./shared");
const tick_1 = require("./tick");
async function ctRunCycle(guild) {
    await core_1.db.$executeRaw `
      UPDATE 
        "public"."PkgCt_Score"
      SET 
        "pointsLastCycle" = "pointsThisCycle",
        "pointsThisCycle" = 0 
    `;
    shared_1.ctLogger.info('COOLTRAINER has been cycled! Running a tick now...');
    await tick_1.ctRunTick(guild);
}
exports.ctRunCycle = ctRunCycle;
