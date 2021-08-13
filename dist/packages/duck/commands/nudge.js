"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const array_1 = require("support/array");
const range_1 = require("support/range");
const BASE_COUNT = new range_1.InclusiveRange(3, 7);
const DISASTERS = config_1.config('pkg.duck.nudge.disasters');
const nudge = async ({ guild, embed, intr }) => {
    embed.poryColor('ok').setTitle(disaster()).setDescription(deaths(guild));
    await intr.reply({ embeds: [embed] });
};
nudge.data = {
    name: 'nudge',
    description: 'Never use this it literally causes natural disasters.',
};
exports.default = nudge;
function disaster() {
    return array_1.random(DISASTERS.value);
}
function deaths(guild) {
    const count = Math.min(BASE_COUNT.random(), guild.memberCount);
    const members = guild.members.cache.random(count);
    return `${array_1.toSentence(members)} were killed.`;
}
