"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lang_1 = require("porygon/lang");
const seedrandom_1 = __importDefault(require("seedrandom"));
const array_1 = require("support/array");
// prettier-ignore
const RESULTS = [
    (e) => e.poryColor('ok').setTitle(lang('spare.title')).setDescription(lang('spare.desc')),
    (e) => e.poryColor('danger').setTitle(lang('kill.title')).setDescription(lang('kill.desc')),
];
const thanos = async ({ embed, intr, author }) => {
    const rng = seedrandom_1.default(author.id);
    const result = array_1.random(RESULTS, rng);
    embed.poryThumb('thanos').merge(result);
    await intr.reply({ embeds: [embed] });
};
thanos.data = {
    name: 'thanos',
    description: 'Rolls the dice on your fate.',
};
exports.default = thanos;
const lang = lang_1.createLang({
    spare: {
        title: 'You were spared by Thanos.',
        desc: 'The universe is now perfectly balanced, as all things should be.',
    },
    kill: {
        title: "Miss Pory... I don't feel so good, you say...",
        desc: 'You were slain by Thanos, for the good of the Universe.',
    },
});
