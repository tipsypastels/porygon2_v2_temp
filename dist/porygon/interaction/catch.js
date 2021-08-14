"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchIntrError = void 0;
const error_1 = require("porygon/error");
const error_filter_1 = require("support/error_filter");
const string_1 = require("support/string");
const logger_1 = require("./logger");
var After;
(function (After) {
    After[After["Ignore"] = 0] = "Ignore";
    After[After["Log"] = 1] = "Log";
})(After || (After = {}));
function catchIntrError(...[error, intr, embed, log]) {
    const after = respond(error, embed);
    intr.reply({ embeds: [embed] });
    after === After.Log && log();
}
exports.catchIntrError = catchIntrError;
function respond(error, embed) {
    if (error_1.isEmbeddedError(error)) {
        embed.merge(error);
        return After.Ignore;
    }
    if (error instanceof Error) {
        embed
            .poryColor('error')
            .poryThumb('error')
            .setTitle("Whoops, that's an error.")
            .setDescription(string_1.codeBlock(error_filter_1.filterErrorMessage(error.message)));
        logger_1.intrLogger.error(error);
        return After.Log;
    }
    embed.poryColor('error').poryThumb('error').setTitle('An unknown error occurred.');
    logger_1.intrLogger.error(error); // better than nothing /shrug
    return After.Log;
}
