"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_1 = require("support/string");
const markov_1 = require("../markov");
const PORY = new markov_1.Markov({
    name: 'pory',
    fallback: 'hi im pory',
});
const pory = async ({ opts, intr, embed, author, client, guild }) => {
    const prompt = opts.try('prompt');
    const response = PORY.speak();
    const bot = guild.members.cache.get(client.user.id);
    if (prompt) {
        embed.addField(author.displayName, string_1.codeBlock(prompt));
    }
    embed
        .addField(bot.displayName, string_1.codeBlock(response))
        .poryColor('ok')
        .poryThumb('speech');
    await intr.reply({ embeds: [embed] });
    // slow, run after reply
    if (prompt) {
        PORY.learn(prompt);
    }
};
pory.data = {
    name: 'pory',
    description: 'Speaks to Porygon. Providing an optional message will allow it to be mixed in to future sentences.',
    options: [
        {
            name: 'prompt',
            type: 'STRING',
            required: false,
            description: 'The message to feed to Pory for future sentences.',
        },
    ],
};
exports.default = pory;
