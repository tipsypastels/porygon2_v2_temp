"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOwner = exports.assertOwner = exports.isOwner = void 0;
const snowflake_1 = require("support/snowflake");
const OWNER = process.env.OWNER;
function isOwner(user) {
    return snowflake_1.resolveSnowflake(user) === OWNER;
}
exports.isOwner = isOwner;
function assertOwner(user) {
    if (!isOwner(user)) {
        throw new Error('This functionality can only be used by the bot owner.');
    }
}
exports.assertOwner = assertOwner;
function findOwner(client) {
    return client.users.cache.get(OWNER);
}
exports.findOwner = findOwner;
