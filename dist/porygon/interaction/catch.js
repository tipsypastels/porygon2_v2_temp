"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchIntrError = void 0;
const error_1 = require("porygon/error");
const error_filter_1 = require("support/error_filter");
const string_1 = require("support/string");
const logger_1 = require("./logger");
function catchIntrError(error, args) {
    const after = injectResponse(error, args.embed);
    args.intr.reply({ embeds: [args.embed] });
    if (after === 1 /* Log */) {
        const { author, commandRef, channel, guild } = args;
        logger_1.intrLogger.error(`${author.user.username} encountered a crash using /${commandRef.name} in ${channel.name}, ${guild.name}. More details may be above.`);
    }
}
exports.catchIntrError = catchIntrError;
function injectResponse(error, embed) {
    if (error_1.isEmbeddedError(error)) {
        embed.merge(error);
        return 0 /* Ignore */;
    }
    if (error instanceof Error) {
        embed
            .poryColor('error')
            .poryThumb('error')
            .setTitle("Whoops, that's an error.")
            .setDescription(string_1.codeBlock(error_filter_1.filterErrorMessage(error.message)));
        logger_1.intrLogger.error(error);
        return 1 /* Log */;
    }
    embed.poryColor('error').poryThumb('error').setTitle('An unknown error occurred.');
    logger_1.intrLogger.error(error); // better than nothing /shrug
    return 1 /* Log */;
}
