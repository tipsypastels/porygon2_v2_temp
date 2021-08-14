"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const embed_1 = require("porygon/embed");
const logger_1 = require("porygon/logger");
const CHANNEL_ID = config_1.config('pkg.duck.joins.channel');
const ROLE_ID = config_1.config('pkg.duck.joins.duck_role');
const join = async ({ events }) => {
    events.on('guildMemberAdd', call);
};
exports.default = join;
function call(member) {
    welcome(member);
    addRole(member);
}
async function welcome(member) {
    const { guild } = member;
    const channel = await guild.channels.fetch(CHANNEL_ID.value);
    if (!channel || !channel.isText()) {
        return logger_1.bugLogger.error('Failed to find Duck Communism welcome channel.');
    }
    const embed = new embed_1.Embed()
        .poryColor('ok')
        .poryThumb('smile')
        .setDescription(`Welcome to the duck zone, ${member.toString()}`);
    channel.send({ embeds: [embed] });
}
async function addRole(member) {
    const { guild } = member;
    const role = await guild.roles.fetch(ROLE_ID.value);
    if (!role) {
        return logger_1.bugLogger.error('Failed to find Duck Communism member role.');
    }
    member.roles.add(role);
}
