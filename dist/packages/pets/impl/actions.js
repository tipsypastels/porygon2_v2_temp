"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petRemove = exports.petAdd = void 0;
const config_1 = require("porygon/config");
const core_1 = require("porygon/core");
const error_1 = require("porygon/error");
const lang_1 = require("porygon/lang");
const table = core_1.db.pkgPets_Pet;
const CHANNEL_ID = config_1.config('pkg.pets.channel');
const MOD_PERM = config_1.config('pkg.pets.mod_perm');
const LIMIT = 10;
async function petAdd(member, channel) {
    assertChannel(channel);
    const [message, url] = await find(member, channel);
    const data = { url, guildId: member.guild.id, userId: member.id };
    const pet = await table.create({ data });
    message.react('✅');
    return function (embed) {
        embed
            .poryColor('ok')
            .setTitle(lang('added.title'))
            .setDescription(lang('added.desc', { id: pet.id }));
    };
}
exports.petAdd = petAdd;
async function petRemove(id, member) {
    const entry = await table.findFirst({ where: { id, guildId: member.guild.id } });
    if (!entry) {
        throw error_1.embeddedError.warnEph((e) => e.setTitle(lang('missing_rem', { id })));
    }
    const isCreator = member.id === entry.userId;
    const isMod = member.permissions.has(MOD_PERM.value);
    if (!isCreator && !isMod) {
        throw error_1.embeddedError.danger((e) => e.setTitle(lang('invalid_rem.title')).setDescription(lang('invalid_rem.desc')));
    }
    await table.delete({ where: { id } });
    return function (embed) {
        embed.poryColor('ok').setTitle(lang('removed.title'));
    };
}
exports.petRemove = petRemove;
async function find(member, channel) {
    const messages = [...(await channel.messages.fetch({ limit: LIMIT })).values()];
    // more likely to be recent
    for (let i = LIMIT - 1; i >= 0; i--) {
        const message = messages[i];
        if (!message || message.author.id !== member.id) {
            continue;
        }
        const attachment = message.attachments.first();
        if (!attachment || !attachment.url) {
            continue;
        }
        return [message, attachment.url];
    }
    throw error_1.embeddedError.warnEph((e) => e.setTitle(lang('missing_add.title')).setDescription(lang('missing_add.desc')));
}
function assertChannel(channel) {
    if (channel.id !== CHANNEL_ID.value) {
        throw error_1.embeddedError.warnEph((e) => e.setTitle(lang('wrong_channel')));
    }
}
const lang = lang_1.createLang({
    wrong_channel: 'Please use the #pets channel to add pets :)',
    missing_add: {
        title: "I couldn't find a pet image from you.",
        desc: 'Please upload a pet image, and then use `/pet add` to save it :)',
    },
    missing_rem: 'No such pet with ID: {id}.',
    invalid_rem: {
        title: "You can't remove that pet!",
        desc: "You may only remove pets that you've uploaded.",
    },
    added: {
        title: 'Pet added!',
        desc: 'Remove this pet from the database at any time via `/pet remove {id}`.',
    },
    removed: {
        title: 'Pet removed!',
    },
});
