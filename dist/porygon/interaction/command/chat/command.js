"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callCommand = void 0;
const discord_js_1 = require("discord.js");
const embed_1 = require("porygon/embed");
const catch_1 = require("porygon/interaction/catch");
const logger_1 = require("porygon/interaction/logger");
const options_1 = require("./options");
const lang_1 = require("porygon/lang");
const callCommand = (intr, cell, command) => {
    const guild = intr.guild;
    const channel = intr.channel;
    if (!guild) {
        console.log('TODO: handle dm command');
        return;
    }
    if (!isCommandChannel(channel)) {
        return;
    }
    const client = cell.client;
    const author = intr.member;
    const embed = new embed_1.Embed();
    const opts = new options_1.CommandOptions(intr.options);
    const args = {
        client,
        guild,
        channel,
        author,
        embed,
        intr,
        opts,
        cell,
    };
    log(command(args), args);
};
exports.callCommand = callCommand;
function isCommandChannel(ch) {
    return !!ch && (ch instanceof discord_js_1.TextChannel || ch instanceof discord_js_1.ThreadChannel);
}
function log(result, args) {
    const params = {
        author: args.author.user.username,
        channel: args.channel.name,
        guild: args.guild.name,
        cmd: args.cell.name,
    };
    result
        .then(() => logger_1.intrLogger.info(lang('ok', params)))
        .catch((error) => catch_1.catchIntrError(error, args.intr, args.embed, () => logger_1.intrLogger.error(lang('err', params))));
}
const lang = lang_1.createLang({
    ok: '{author} used /{cmd} in {channel}, {guild}.',
    err: '{author} encountered a crash using /{cmd} in {channel}, {guild}. More details may be above.',
});
