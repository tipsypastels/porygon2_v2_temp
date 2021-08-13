"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const owner_1 = require("porygon/owner");
const desc = config_1.config('help_desc');
const help = async ({ client, embed, intr }) => {
    const owner = owner_1.findOwner(client);
    const ownerAvatar = owner?.avatarURL() ?? undefined;
    embed
        .poryColor('info')
        .poryThumb('smile')
        .setTitle("Hello! My name's Pory.")
        .setDescription(desc.value)
        .setFooter('Created by Dakota', ownerAvatar);
    await intr.reply({ embeds: [embed], ephemeral: true });
};
help.data = {
    name: 'help',
    description: 'Shows basic help information',
};
exports.default = help;
