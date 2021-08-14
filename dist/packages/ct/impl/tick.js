"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctRunTick = void 0;
const client_1 = require("@prisma/client");
const core_1 = require("porygon/core");
const logger_1 = require("porygon/logger");
const shared_1 = require("./shared");
async function ctRunTick(guild) {
    const role = await guild.roles.fetch(shared_1.CtConfig.roleId);
    if (!role) {
        return logger_1.bugLogger.error('Cooltrainer role not found. Aborting tick.');
    }
    const has = (member) => {
        return member.roles.cache.has(role.id);
    };
    const give = () => {
        return eachMember('above', async (member) => {
            if (has(member))
                return;
            await member.roles.add(role);
            log(member, 'earned');
        });
    };
    const take = () => {
        return eachMember('below', async (member) => {
            if (!has(member))
                return;
            await member.roles.remove(role);
            log(member, 'lost');
        });
    };
    async function eachMember(where, each) {
        const entries = await query(where);
        const promises = entries.map(async ({ userId }) => {
            const member = await toMember(userId);
            if (member) {
                await each(member);
            }
        });
        await Promise.all(promises);
    }
    function toMember(userId) {
        return guild.members.fetch(userId).catch(() => null);
    }
    await Promise.all([give(), take()]);
}
exports.ctRunTick = ctRunTick;
function query(where) {
    const op = where === 'above' ? '>' : '<';
    const threshold = shared_1.CtConfig.threshold;
    return core_1.db.$queryRaw `
      SELECT 
        "userId"
      FROM
        "public"."PkgCt_Score"
      WHERE
        "pointsThisCycle" + "pointsLastCycle" ${client_1.Prisma.raw(op)} ${threshold}
    `;
}
function log(member, action) {
    shared_1.ctLogger.info(`${member.user.username} ${action} COOLTRAINER.`);
}
