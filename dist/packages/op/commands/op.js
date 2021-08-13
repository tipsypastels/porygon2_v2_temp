"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dev_1 = require("porygon/dev");
const interaction_1 = require("porygon/interaction");
const owner_1 = require("porygon/owner");
const stats_1 = require("porygon/stats");
const Assets = __importStar(require("porygon/assets"));
const preview_1 = require("porygon/asset/preview");
const say = async ({ opts, intr, embed, author }) => {
    owner_1.assertOwner(author);
    const { channel, message } = opts.pick('channel', 'message');
    await Promise.all([
        channel.send(message),
        intr.reply({ content: '✅', ephemeral: true }),
    ]);
};
const stats = async ({ embed, intr, client, author }) => {
    owner_1.assertOwner(author);
    embed
        .poryColor('info')
        .setTitle('Stats for operators')
        .addField('Servers', client.guilds.cache.size.toString())
        .addField('Uptime', stats_1.uptime.inWords())
        .addField('Heartbeat', `${client.ws.ping}ms`);
    await intr.reply({ embeds: [embed] });
};
const previewasset = async ({ opts, intr, channel, author, }) => {
    owner_1.assertOwner(author);
    const name = opts.get('asset');
    const asset = fetchAsset(name);
    await intr.reply({ content: '✅ Beginning preview', ephemeral: true });
    await preview_1.previewAssets(asset, channel);
    await intr.followUp({ content: '✅ Completed preview', ephemeral: true });
};
const op = interaction_1.commandGroups({ say, stats, previewasset });
op.data = {
    name: 'op',
    defaultPermission: dev_1.DEV,
    description: 'Operator-only utilities.',
    options: [
        {
            name: 'say',
            description: 'Send a message to any channel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send to.',
                    type: 'CHANNEL',
                    required: true,
                },
                {
                    name: 'message',
                    description: 'The message to send.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
        {
            name: 'stats',
            description: 'Shows useful stats.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'previewasset',
            description: 'Previews an asset or asset group.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'asset',
                    description: 'Exported name of asset to preview.',
                    type: 'STRING',
                    required: true,
                },
            ],
        },
    ],
};
exports.default = op;
function fetchAsset(name) {
    if (!(name in Assets)) {
        throw new Error(`Unknown asset: ${name}.`);
    }
    return Assets[name];
}
