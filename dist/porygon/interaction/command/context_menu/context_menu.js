"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callContextMenu = void 0;
const discord_js_1 = require("discord.js");
const embed_1 = require("porygon/embed");
const catch_1 = require("porygon/interaction/catch");
const logger_1 = require("porygon/interaction/logger");
const lang_1 = require("porygon/lang");
const callContextMenu = (intr, cell, command) => {
    const client = cell.client;
    const { guild, member: author } = intr;
    const embed = new embed_1.Embed();
    if (!guild || !(author instanceof discord_js_1.GuildMember)) {
        return;
    }
    const args = merge({
        client,
        guild,
        author,
        embed,
        intr,
        cell,
    });
    if (!args) {
        return;
    }
    log(command(args), args);
};
exports.callContextMenu = callContextMenu;
function merge(args) {
    if (args.intr.targetType === 'MESSAGE') {
        const message = args.intr.options.getMessage('message', true);
        if (!(message instanceof discord_js_1.Message)) {
            logger_1.intrLogger.debug('MsgContextMenu received an invalid message, aborting...');
            return;
        }
        args.message = message;
    }
    else {
        const member = args.intr.options.getMember('user', true);
        if (!(member instanceof discord_js_1.GuildMember)) {
            logger_1.intrLogger.debug('MsgContextMenu received an invalid member, aborting...');
            return;
        }
        args.member = member;
    }
    return args;
}
function log(result, args) {
    const params = {
        author: args.author.user.username,
        type: args.intr.targetType.toLowerCase(),
        guild: args.guild.name,
        cmd: args.cell.name,
    };
    result
        .then(() => logger_1.intrLogger.info(lang('ok', params)))
        .catch((error) => catch_1.catchIntrError(error, args.intr, args.embed, () => logger_1.intrLogger.error(lang('err', params))));
}
const lang = lang_1.createLang({
    ok: '{author} used {type} menu {cmd} in {guild}.',
    err: '{author} encountered a crash using {type} menu {cmd} in {guild}. More details may be above.',
});
