"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDeletions = void 0;
const embed_1 = require("porygon/embed");
const format_1 = __importDefault(require("date-fns/format"));
const string_1 = require("support/string");
const output_channel_1 = require("./output_channel");
function logDeletions(events, opts) {
    function run(message) {
        const { author, guild } = message;
        if (!author || !guild) {
            return;
        }
        const verbose = (embed) => {
            if (opts.verbosity === 'verbose') {
                embed
                    .addInlineField('Deleted at', format(new Date()))
                    .addField('Message ID', string_1.codeBlock(message.id))
                    .addField('User ID', string_1.codeBlock(author.id));
            }
        };
        const embed = new embed_1.Embed()
            .poryColor('info')
            .setAuthor(...embed_1.fromUser(author))
            .setTitle('Message Deleted')
            .setDescription(message.content ?? '*(no content)*')
            .addInlineField('Channel', message.channel.toString())
            .addInlineField('Sent at', format(message.createdAt))
            .merge(verbose);
        output_channel_1.outputLogs(opts.logTo, embed, guild);
    }
    events.on('messageDelete', run);
}
exports.logDeletions = logDeletions;
function format(date) {
    return format_1.default(date, string_1.code('hh:mm:ss b'));
}
