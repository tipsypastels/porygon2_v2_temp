"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interaction_1 = require("porygon/interaction");
const pats_1 = require("../pats");
const member = async ({ opts, embed, intr, author }) => {
    const member = opts.get('member');
    if (member.id !== author.id) {
        pats_1.incrementPatCount(member);
        embed.setFooter('+1 headpat score!');
    }
    embed
        .poryColor('ok')
        .setDescription(`${member} has been headpat!`)
        .setImage(pats_1.getPatGif());
    await intr.reply({ embeds: [embed] });
};
const leaderboard = async ({ embed, intr, guild }) => {
    for await (const { member, pats } of pats_1.patLeaderboard(guild)) {
        embed.addField(member.displayName, `${pats}`);
    }
    embed.poryColor('info').setTitle('Headpats Received');
    await intr.reply({ embeds: [embed] });
};
const pat = interaction_1.commandGroups({ member, leaderboard });
pat.data = {
    name: 'pat',
    description: '*headpats*',
    options: [
        {
            name: 'member',
            type: 'SUB_COMMAND',
            description: 'Headpats a member.',
            options: [
                {
                    name: 'member',
                    type: 'USER',
                    description: 'Member to pat.',
                    required: true,
                },
            ],
        },
        {
            name: 'leaderboard',
            type: 'SUB_COMMAND',
            description: 'Shows the most headpatted members.',
        },
    ],
};
exports.default = pat;
