"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const array_1 = require("support/array");
const LINES = config_1.config('pkg.duck.8ball.lines');
const _8ball = async ({ opts, embed, intr }) => {
    const line = array_1.random(LINES.value);
    embed
        .poryColor('info')
        .poryThumb('8ball')
        .setTitle('The wise oracle Porygon studies her magic 8-ball.')
        .addField('Question', opts.get('question'))
        .addField('Answer', line);
    await intr.reply({ embeds: [embed] });
};
_8ball.data = {
    name: '8ball',
    description: 'Asks a question of the wise oracle Porygon.',
    options: [
        {
            name: 'question',
            type: 'STRING',
            required: true,
            description: 'The question you would ask the wise oracle Porygon.',
        },
    ],
};
exports.default = _8ball;
