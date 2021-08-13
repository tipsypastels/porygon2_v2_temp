"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = void 0;
const discord_js_1 = require("discord.js");
const embed_1 = require("porygon/embed");
const catch_1 = require("../catch");
const logger_1 = require("../logger");
const options_1 = require("./options");
function runCommand({ command, commandRef, intr }) {
    const guild = intr.guild;
    const channel = intr.channel;
    if (!guild) {
        console.log('TODO: handle dm command');
        return;
    }
    if (!isCommandChannel(channel)) {
        return;
    }
    const client = commandRef.client;
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
        commandRef,
    };
    command(args)
        .then(() => {
        logger_1.intrLogger.info(`${author.user.username} used /${command.data.name} in ${channel.name}, ${guild.name}`);
    })
        .catch((error) => {
        catch_1.catchIntrError(error, args);
    });
}
exports.runCommand = runCommand;
function isCommandChannel(ch) {
    return !!ch && (ch instanceof discord_js_1.TextChannel || ch instanceof discord_js_1.ThreadChannel);
}
