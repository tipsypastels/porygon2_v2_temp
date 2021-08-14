"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupActivityMessages = void 0;
const config_1 = require("porygon/config");
const schedule_1 = require("porygon/schedule");
const array_1 = require("support/array");
const MESSAGES = config_1.config('activity_messages');
function setupActivityMessages(client) {
    set(client);
    schedule_1.schedule('pory.activity', '0,30 * * * *', () => set(client));
}
exports.setupActivityMessages = setupActivityMessages;
function set(client) {
    const { user } = client;
    if (!user) {
        return; // before ready event
    }
    user.setActivity(array_1.random(MESSAGES.value));
}
