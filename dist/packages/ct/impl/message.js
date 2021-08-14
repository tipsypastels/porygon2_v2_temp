"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ctHandleMessage = void 0;
const score_1 = require("./score");
const shared_1 = require("./shared");
function ctHandleMessage(message) {
    if (message.author.bot) {
        return;
    }
    const { member } = message;
    const points = pointsFor(message);
    if (!member || !points) {
        return;
    }
    score_1.ctIncrementScore(member, points);
}
exports.ctHandleMessage = ctHandleMessage;
function pointsFor(message) {
    return shared_1.CtConfig.ppmExceptions[message.channelId] ?? 1;
}
