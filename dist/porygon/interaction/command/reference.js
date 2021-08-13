"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandReference = void 0;
const command_1 = require("./command");
class CommandReference {
    constructor(pkg, api, command) {
        this.pkg = pkg;
        this.api = api;
        this.command = command;
    }
    get id() {
        return this.api.id;
    }
    get name() {
        return this.api.name;
    }
    get client() {
        return this.pkg.client;
    }
    call(intr) {
        return command_1.runCommand({ command: this.command, commandRef: this, intr });
    }
}
exports.CommandReference = CommandReference;
