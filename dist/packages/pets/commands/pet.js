"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interaction_1 = require("porygon/interaction");
const impl_1 = require("../impl");
const add = async ({ embed, intr, author, channel }) => {
    const result = await impl_1.petAdd(author, channel);
    embed.merge(result);
    await intr.reply({ embeds: [embed] });
};
const remove = async ({ opts, embed, intr, author }) => {
    const id = opts.get('id');
    const result = await impl_1.petRemove(id, author);
    embed.merge(result);
    await intr.reply({ embeds: [embed] });
};
const random = async ({ opts, embed, intr, guild }) => {
    const member = opts.try('by') ?? undefined;
    const result = await impl_1.petRandom(guild, member);
    embed.merge(result);
    await intr.reply({ embeds: [embed] });
};
const pet = interaction_1.commandGroups({ add, remove, random });
pet.data = {
    name: 'pet',
    description: 'Commands relating to pets.',
    options: [
        {
            name: 'random',
            description: 'Shows a random pet by a user, or by anyone in the server if no user is provided.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'by',
                    type: 'USER',
                    description: 'The user whose pets should be shown.',
                    required: false,
                },
            ],
        },
        {
            name: 'add',
            description: 'Adds a new pet.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'remove',
            description: "Removes a pet image from Porygon's database.",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'id',
                    type: 'INTEGER',
                    description: 'ID of the pet image.',
                    required: true,
                },
            ],
        },
    ],
};
exports.default = pet;
