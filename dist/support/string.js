"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripSpaces = exports.bold = exports.code = exports.codeBlock = void 0;
const util_1 = require("util");
/**
 * Wraps the message in a Discord code block.
 */
function codeBlock(message, opts = {}) {
    if (opts.inspect)
        message = util_1.inspect(message);
    return `\`\`\`${opts.lang}\n${message}\`\`\``;
}
exports.codeBlock = codeBlock;
/**
 * Wraps the message in a Discord inline code.
 */
function code(message) {
    return `\`${message}\``;
}
exports.code = code;
/**
 * Formats a message as Discord bold.
 */
function bold(message) {
    return `**${message}**`;
}
exports.bold = bold;
/**
 * Removes all spaces from `input`.
 */
function stripSpaces(input) {
    return input.replace(/ /g, '');
}
exports.stripSpaces = stripSpaces;
