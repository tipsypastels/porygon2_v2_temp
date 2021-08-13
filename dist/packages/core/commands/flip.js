"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const COLOR = 0xe1a339;
const FACES = {
    heads: {
        text: 'Heads',
        emoji: '<:heads:831074796925091861>',
    },
    tails: {
        text: 'Tails',
        emoji: '<:tails:831074797294845952>',
    },
};
const flip = async ({ embed, intr }) => {
    const bool = Math.random() > 0.5;
    const result = bool ? FACES.heads : FACES.tails;
    embed.setColor(COLOR).setTitle(`${result.text}!`).setDescription(result.emoji);
    await intr.reply({ embeds: [embed] });
};
flip.data = {
    name: 'flip',
    description: 'Flips a coin.',
};
exports.default = flip;
