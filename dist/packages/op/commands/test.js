"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test = async ({ intr, member, author }) => {
    await intr.reply(`${member.displayName} - ${author.displayName}`);
};
test.data = {
    name: 'test',
    type: 'USER',
};
exports.default = test;
