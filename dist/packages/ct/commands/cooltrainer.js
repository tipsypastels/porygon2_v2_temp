"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("porygon/dev");
const interaction_1 = require("porygon/interaction");
const impl_1 = require("../impl");
const scoreboard = async ({ embed, intr, guild }) => {
    const scoreboard = impl_1.ctCreateScoreboard(guild);
    for await (const { member, score } of scoreboard) {
        embed.addField(member.displayName, score.toString());
    }
    embed.poryColor('info').setTitle('COOLTRAINER Scoreboard');
    await intr.reply({ embeds: [embed] });
};
const tick = async ({ embed, intr, guild }) => {
    impl_1.ctRunTick(guild);
    embed.poryColor('ok').setTitle('Initiated a COOLTRAINER tick.');
    await intr.reply({ embeds: [embed], ephemeral: true });
};
const cycle = async ({ embed, intr, guild }) => {
    impl_1.ctRunCycle(guild);
    embed.poryColor('ok').setTitle('Initiated a COOLTRAINER cycle.');
    await intr.reply({ embeds: [embed], ephemeral: true });
};
const show = async ({ opts, intr, embed }) => {
    const member = opts.get('member');
    const summary = await impl_1.ctFetchSummary(member);
    embed
        .poryColor('info')
        .setTitle(member.displayName)
        .addField('Score', summary.score.toString())
        .addField('Has COOLTRAINER', summary.state);
    await intr.reply({ embeds: [embed] });
};
const cooltrainer = interaction_1.commandGroups({ show, scoreboard, tick, cycle });
cooltrainer.data = {
    name: 'cooltrainer',
    description: 'Commands relating to cooltrainer.',
    defaultPermission: dev_1.DEV,
    options: [
        {
            name: 'scoreboard',
            type: 'SUB_COMMAND',
            description: 'Shows the top cooltrainer scores.',
        },
        {
            name: 'show',
            type: 'SUB_COMMAND',
            description: 'Shows the cooltrainer information for a user.',
            options: [
                {
                    name: 'member',
                    type: 'USER',
                    description: 'User to show cooltrainer information for.',
                    required: true,
                },
            ],
        },
        {
            name: 'tick',
            type: 'SUB_COMMAND',
            description: "[UNSAFE] Manually runs a cooltrainer tick, recalculating everyone's roles accordingly.",
        },
        {
            name: 'cycle',
            type: 'SUB_COMMAND',
            description: '[UNSAFE] Manually runs a cooltrainer weekly cycle, clearing out points from the previous week.',
        },
    ],
};
exports.default = cooltrainer;
