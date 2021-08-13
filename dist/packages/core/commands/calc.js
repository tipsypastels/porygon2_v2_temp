"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = require("porygon/math");
const string_1 = require("support/string");
const calc = async ({ opts, intr, embed }) => {
    const equation = opts.get('equation');
    embed.addField('Equation', string_1.codeBlock(equation));
    try {
        const result = await math_1.evaluate(equation);
        embed
            .poryColor('info')
            .setTitle('Aaaand the answer is...')
            .addField('Result', string_1.codeBlock(result));
    }
    catch (error) {
        embed
            .poryColor('warning')
            .addField('Error', string_1.codeBlock(error.message))
            .setTitle('_Porygon adjusts her glasses and takes another look at that equation._');
    }
    await intr.reply({ embeds: [embed] });
};
calc.data = {
    name: 'calc',
    description: 'Does your math homework.',
    options: [
        {
            name: 'equation',
            type: 'STRING',
            required: true,
            description: 'An equation to evaluate.',
        },
    ],
};
exports.default = calc;
