"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const array_1 = require("support/array");
const string_1 = require("support/string");
const POSITIVE_TRAITS = config_1.config('pkg.duck.vibe.positive_traits');
const NEGATIVE_TRAITS = config_1.config('pkg.duck.vibe.negative_traits');
const vibe = async ({ embed, intr, author }) => {
    const { displayName: name } = author;
    const pos = trait(POSITIVE_TRAITS);
    const neg = trait(NEGATIVE_TRAITS);
    embed
        .poryColor('info')
        .poryThumb('vibe')
        .setAuthor('✨ 𝓋𝒾𝒷𝑒 𝒸𝒽𝑒𝒸𝓀 ✨')
        .setTitle(`${name}'s vibe`)
        .setDescription(`${name} is ${neg} but makes up for it by ${pos}.`);
    await intr.reply({ embeds: [embed] });
};
vibe.data = {
    name: 'vibe',
    description: 'Scientifically analyzes your vibes.',
};
exports.default = vibe;
function trait(list) {
    return string_1.bold(array_1.random(list.value));
}
