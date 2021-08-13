"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageGuilds = exports.PackageGuild = exports.PackageGlobal = exports.PackageDev = void 0;
const config_1 = require("porygon/config");
const dev_1 = require("porygon/dev");
const logger_1 = require("porygon/logger");
const cache_1 = require("support/cache");
const DEV_SERVER = config_1.config('dev_server');
class PackageDev {
    constructor() {
        /* nop */
    }
    static init() {
        if (!dev_1.DEV) {
            logger_1.bugLogger.error('Tried to create a PackageDev in production.');
        }
        return this.MEMO.get();
    }
    guild(client) {
        return client.guilds.cache.get(DEV_SERVER.value);
    }
    matches() {
        return true;
    }
    async upload(data, client) {
        return toArray(await this.guild(client).commands.set(data));
    }
}
exports.PackageDev = PackageDev;
PackageDev.MEMO = new cache_1.Singleton(() => new PackageDev());
class PackageGlobal {
    constructor() {
        /* nop */
    }
    static init() {
        return this.MEMO.get();
    }
    matches() {
        return true;
    }
    async upload(data, client) {
        return toArray(await client.application.commands.set(data));
    }
}
exports.PackageGlobal = PackageGlobal;
PackageGlobal.MEMO = new cache_1.Singleton(() => new PackageGlobal());
class PackageGuild {
    constructor(guildId) {
        this.guildId = guildId;
        /* nop */
    }
    static init(guildId) {
        return this.ALL.get(guildId);
    }
    guild(client) {
        return client.guilds.cache.get(this.guildId);
    }
    matches(guildId) {
        return this.guildId === guildId;
    }
    async upload(data, client) {
        const guild = this.guild(client);
        return toArray(await guild?.commands.set(data));
    }
}
exports.PackageGuild = PackageGuild;
PackageGuild.ALL = new cache_1.Cache((guildId) => {
    return new PackageGuild(guildId);
});
class PackageGuilds {
    constructor(guildIds) {
        this.packages = guildIds.map((id) => PackageGuild.init(id));
    }
    matches(guildId) {
        return !!guildId && this.packages.some((p) => p.matches(guildId));
    }
    async upload(data, client) {
        const promises = this.packages.map((p) => p.upload(data, client));
        const [commands] = await Promise.all(promises);
        return commands; // all entries are the same
    }
}
exports.PackageGuilds = PackageGuilds;
function toArray(collection) {
    return collection ? [...collection.values()] : [];
}
