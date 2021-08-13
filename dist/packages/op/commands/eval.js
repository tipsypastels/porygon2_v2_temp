"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("porygon//core");
const owner_1 = require("porygon/owner");
const string_1 = require("support/string");
const package_1 = require("porygon/package");
const dev_1 = require("porygon/dev");
const eval_ = async (args) => {
    owner_1.assertOwner(args.author);
    const { intr, author, guild, embed, client, opts, commandRef } = args;
    const code = opts.get('code');
    const { pkg } = commandRef;
    const db = core_1.db;
    const Package = package_1.Package;
    const result = eval(code);
    embed
        .poryColor('ok')
        .setTitle('Evaluated Code')
        .addField('Input', js(code, { inspect: false }))
        .addField('Output', js(result, { inspect: true }));
    await intr.reply({ embeds: [embed] });
};
eval_.data = {
    name: 'eval',
    defaultPermission: dev_1.DEV,
    description: "If you don't know what this does, you shouldn't be using it.",
    options: [
        {
            name: 'code',
            type: 'STRING',
            required: true,
            description: 'Code to be run.',
        },
    ],
};
exports.default = eval_;
function js(code, { inspect }) {
    return string_1.codeBlock(code, { lang: 'js', inspect });
}
