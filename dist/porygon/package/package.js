"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Package = void 0;
const discord_js_1 = require("discord.js");
const interaction_1 = require("porygon/interaction");
const array_1 = require("support/array");
class Package {
    constructor(kind, client) {
        this.kind = kind;
        this.client = client;
        this.unsavedCommands = [];
        Package.ALL.set(kind, this);
    }
    static uploadAllCommands() {
        return Promise.all(this.ALL.map((p) => p.uploadCommands()));
    }
    static init(kind, client) {
        return this.ALL.get(kind) || new this(kind, client);
    }
    addCommand(command) {
        this.unsavedCommands.push(command);
    }
    async uploadCommands() {
        const data = this.unsavedCommands.map((c) => c.data);
        const apis = await this.kind.upload(data, this.client);
        for (const [command, api] of array_1.zip(this.unsavedCommands, apis)) {
            const ref = new interaction_1.CommandReference(this, api, command);
            Package.SAVED_COMMANDS.set(ref.id, ref);
        }
        this.unsavedCommands = [];
    }
}
exports.Package = Package;
Package.ALL = new discord_js_1.Collection();
Package.SAVED_COMMANDS = new discord_js_1.Collection();
