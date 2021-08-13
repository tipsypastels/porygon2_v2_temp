"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patLeaderboard = exports.incrementPatCount = exports.getPatGif = void 0;
const assets_1 = require("porygon/assets");
const core_1 = require("porygon/core");
function getPatGif() {
    return assets_1.HEADPAT_ASSETS.random().url;
}
exports.getPatGif = getPatGif;
async function incrementPatCount({ id }, by = 1) {
    await core_1.db.$executeRaw `
    INSERT INTO
      "public"."PkgDuck_PatCount" ("userId", "pats")
    VALUES
      (${id}, ${by})
    ON CONFLICT ON CONSTRAINT
      "PkgDuck_PatCount_pkey"
    DO UPDATE
    SET pats = (
      "PkgDuck_PatCount"."pats" + "excluded"."pats"
    )
  `;
}
exports.incrementPatCount = incrementPatCount;
async function* patLeaderboard(guild) {
    const entries = await fetchLeaderboard();
    const memberPromises = entries.map(({ userId }) => guild.members.fetch(userId).catch(() => null));
    const members = await Promise.all(memberPromises);
    for (let i = 0; i < entries.length; i++) {
        const member = members[i];
        const pats = entries[i].pats;
        if (member && pats) {
            yield { member, pats };
        }
    }
}
exports.patLeaderboard = patLeaderboard;
function fetchLeaderboard() {
    return core_1.db.$queryRaw `
    SELECT
      "userId",
      "pats"
    FROM
      "public"."PkgDuck_PatCount"
    ORDER BY
      "pats" DESC
    LIMIT
      10
  `;
}
