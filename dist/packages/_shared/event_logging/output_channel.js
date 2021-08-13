"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outputLogs = void 0;
const logger_1 = require("porygon/logger");
function outputLogs(ch, embed, guild) {
    const channelIds = resolve(ch);
    const promises = channelIds.map(async (id) => {
        const channel = await guild.channels.fetch(id);
        // All the channel IDs we get here are from config, so treat
        // type errors as a bug rather than user error.
        if (!channel) {
            logger_1.bugLogger.error(`Tried to log to nonexistant channel ${id}`);
            return;
        }
        if (!channel.isText()) {
            logger_1.bugLogger.error(`Tried to log to non-text channel ${id}.`);
            return;
        }
        channel.send({ embeds: [embed] });
    });
    return Promise.all(promises);
}
exports.outputLogs = outputLogs;
function resolve(ch) {
    return Array.isArray(ch) ? ch.map(resolveSingle) : [resolveSingle(ch)];
}
function resolveSingle(ch) {
    return typeof ch === 'string' ? ch : ch.value;
}
