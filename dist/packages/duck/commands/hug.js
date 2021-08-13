"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("support/array");
const STATS = ['Attack', 'Defense', 'Speed', 'Special Attack', 'Special Defense', 'HP'];
const hug = async ({ opts, embed, intr, author }) => {
    const subject = opts.get('member');
    const isSelf = author.id === subject.id;
    const subjectLine = isSelf ? 'themself' : subject.displayName;
    const stat = array_1.random(STATS);
    embed
        .poryColor('ok')
        .setTitle(`${author.displayName} hugs ${subjectLine}!`)
        .setDescription(`:hugging: ${subject.displayName}'s ${stat} rose!`);
    await intr.reply({ embeds: [embed] });
};
hug.data = {
    name: 'hug',
    description: 'Hugs a friend.',
    options: [
        {
            name: 'member',
            type: 'USER',
            description: 'The member to hug.',
            required: true,
        },
    ],
};
exports.default = hug;
