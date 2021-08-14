"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupEventFactory = void 0;
const discord_js_1 = require("discord.js");
function proxy(client, kind) {
    function wrap(occ, key, cb) {
        return client[occ](key, (...args) => {
            const guild = toGuild(args[0]);
            if (kind.matches(guild?.id)) {
                cb(...args);
            }
        });
    }
    function on(key, cb) {
        return wrap('on', key, cb);
    }
    function once(key, cb) {
        return wrap('once', key, cb);
    }
    function globalOn(key, cb) {
        return client.on(key, cb);
    }
    function globalOnce(key, cb) {
        return client.once(key, cb);
    }
    return { on, once, globalOn, globalOnce };
}
function toGuild(obj) {
    if (obj instanceof discord_js_1.Guild) {
        return obj;
    }
    if (obj.guild instanceof discord_js_1.Guild) {
        return obj.guild;
    }
}
function setupEventFactory(client, kind, factory) {
    factory({ client, kind, events: proxy(client, kind) });
}
exports.setupEventFactory = setupEventFactory;
