"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const array_1 = require("support/array");
const LINES = config_1.config('pkg.duck.inky.lines');
const inky = async ({ embed, intr }) => {
    embed.poryColor('info').poryThumb('plead').setDescription(array_1.random(LINES.value));
    await intr.reply({ embeds: [embed] });
};
inky.data = {
    name: 'inky',
    description: '🥺',
};
exports.default = inky;
