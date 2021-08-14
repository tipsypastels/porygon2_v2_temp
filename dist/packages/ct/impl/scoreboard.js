"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctCreateScoreboard = void 0;
const core_1 = require("porygon/core");
async function* ctCreateScoreboard(guild) {
    function toMember({ userId }) {
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
exports.ctCreateScoreboard = ctCreateScoreboard;
function fetch() {
    return core_1.db.$queryRaw `
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
