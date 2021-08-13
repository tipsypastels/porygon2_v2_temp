"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const dev_1 = require("porygon/dev");
const interaction_1 = require("porygon/interaction");
const owner_1 = require("porygon/owner");
const string_1 = require("support/string");
const get = async ({ opts, intr, embed }) => {
    const key = opts.get('key');
    const { value } = config_1.config(key);
    embed
        .poryColor('info')
        .setTitle('Config')
        .addField('Key', string_1.code(key))
        .addField('Value', string_1.codeBlock(value, { inspect: true, lang: 'js' }));
    await intr.reply({ embeds: [embed] });
};
const set = async ({ opts, intr, embed }) => {
    const { key, value: rawValue } = opts.pick('key', 'value');
    await parse(rawValue)
        .then((value) => {
        config_1.setConfig(key, value);
        embed
            .poryColor('ok')
            .setTitle('Config updated!')
            .addField('Key', string_1.code(key))
            .addField('New Value', string_1.codeBlock(value, { lang: 'js' }));
        return intr.reply({ embeds: [embed] });
    })
        .catch(() => {
        embed
            .poryColor('error')
            .setTitle('JSON was badly formed. Please try that again.')
            .setDescription(string_1.codeBlock(rawValue, { lang: 'json' }));
        return intr.reply({ embeds: [embed], ephemeral: true });
    });
};
const update = async ({ opts, intr, embed, author }) => {
    owner_1.assertOwner(author);
    const { key, expression } = opts.pick('key', 'expression');
    const { value: currentValue } = await config_1.config(key);
    const nextValue = evaluate(expression, currentValue);
    config_1.setConfig(key, nextValue);
    embed
        .poryColor('ok')
        .setTitle('Config updated!')
        .addField('Key', string_1.code(key))
        .addField('New Value', string_1.codeBlock(nextValue, { lang: 'js' }));
    await intr.reply({ embeds: [embed] });
};
const cfg = interaction_1.commandGroups({ get, set, update });
cfg.data = {
    name: 'cfg',
    description: 'Gets or sets a Porygon configuration value by its internal ID.',
    defaultPermission: dev_1.DEV,
    options: [
        {
            name: 'get',
            type: 'SUB_COMMAND',
            description: 'Gets a configuration value.',
            options: [
                {
                    name: 'key',
                    type: 'STRING',
                    required: true,
                    description: 'The ID of the value to find.',
                },
            ],
        },
        {
            name: 'set',
            type: 'SUB_COMMAND',
            description: 'Sets a configuration value.',
            options: [
                {
                    name: 'key',
                    type: 'STRING',
                    required: true,
                    description: 'The ID of the value to set.',
                },
                {
                    name: 'value',
                    type: 'STRING',
                    required: true,
                    description: 'An expression that evaluates to a new value.',
                },
            ],
        },
        {
            name: 'update',
            type: 'SUB_COMMAND',
            description: 'Updates a configuration value by evaluating a JavaScript expression.',
            options: [
                {
                    name: 'key',
                    type: 'STRING',
                    required: true,
                    description: 'The ID of the value to update.',
                },
                {
                    name: 'expression',
                    type: 'STRING',
                    required: true,
                    description: 'The value to update to.',
                },
            ],
        },
    ],
};
exports.default = cfg;
async function parse(code) {
    return JSON.parse(code);
}
function evaluate(expr, thisValue) {
    return new Function(`return ${expr}`).call(thisValue);
}
