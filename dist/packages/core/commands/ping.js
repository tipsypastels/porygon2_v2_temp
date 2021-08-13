"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stats_1 = require("porygon/stats");
const ping = async ({ intr, embed, client }) => {
    embed
        .poryColor('info')
        .poryThumb('speech')
        .setTitle(':sparkles: Pong! Porygon is online~')
        .setDescription('_beep boop_ How are you today?')
        .addField('Uptime', stats_1.uptime.inWords())
        .addField('Heartbeat', `${client.ws.ping}ms`);
    await intr.reply({ embeds: [embed], ephemeral: true });
};
ping.data = {
    name: 'ping',
    description: 'Pings Porygon.',
};
exports.default = ping;
