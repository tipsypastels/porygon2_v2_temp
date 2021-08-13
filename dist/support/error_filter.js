"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterErrorMessage = void 0;
function filterErrorMessage(message) {
    return message
        .replace(process.env.TOKEN, '<filtered>')
        .replace(process.env.DATABASE_URL, '<filtered>');
}
exports.filterErrorMessage = filterErrorMessage;
