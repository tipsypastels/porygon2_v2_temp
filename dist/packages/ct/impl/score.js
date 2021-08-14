"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctFetchSummary = exports.ctIncrementScore = exports.CtRoleState = void 0;
const core_1 = require("porygon/core");
const shared_1 = require("./shared");
const table = core_1.db.pkgCt_Score;
var CtRoleState;
(function (CtRoleState) {
    CtRoleState["Yes"] = "\u2705 Yes.";
    CtRoleState["No"] = "\u274C No.";
    CtRoleState["WillRemove"] = "\uD83D\uDD52 Yes. Will be removed next tick due to decreasing score.";
    CtRoleState["WillAdd"] = "\uD83D\uDD52 No. Will be added next tick due to increasing score.";
})(CtRoleState = exports.CtRoleState || (exports.CtRoleState = {}));
async function ctIncrementScore(member, amount) {
    await core_1.db.$executeRaw `
      INSERT INTO 
        "public"."PkgCt_Score" ("userId", "pointsThisCycle")
      VALUES 
        (${member.id}, ${amount})
      ON CONFLICT ON CONSTRAINT 
        "PkgCt_Score_pkey" 
      DO UPDATE
      SET "pointsThisCycle" = (
        "PkgCt_Score"."pointsThisCycle" + "excluded"."pointsThisCycle"
      )
  `;
}
exports.ctIncrementScore = ctIncrementScore;
async function ctFetchSummary(member) {
    const score = await fetchScore(member);
    const state = roleState(hasRole(member), aboveThreshold(score));
    return { score, state };
}
exports.ctFetchSummary = ctFetchSummary;
function fetchScore(member) {
    return fetch(member).then(sum);
}
function fetch(member) {
    return table.findFirst({ where: { userId: member.id } });
}
function sum(entry) {
    return entry ? entry.pointsThisCycle + entry.pointsLastCycle : 0;
}
function roleState(hasRole, aboveThreshold) {
    if (hasRole && aboveThreshold)
        return CtRoleState.Yes;
    if (hasRole && !aboveThreshold)
        return CtRoleState.WillRemove;
    if (!hasRole && aboveThreshold)
        return CtRoleState.WillAdd;
    return CtRoleState.No;
}
function hasRole(member) {
    return member.roles.cache.has(shared_1.CtConfig.roleId);
}
function aboveThreshold(points) {
    return points >= shared_1.CtConfig.threshold;
}
