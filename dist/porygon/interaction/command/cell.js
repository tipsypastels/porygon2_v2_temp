"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const context_menu_1 = require("./context_menu/context_menu");
const chat_1 = require("./chat");
class Cell {
    constructor(pkg, api, cmd) {
        this.pkg = pkg;
        this.api = api;
        this.cmd = cmd;
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
        if (intr.isCommand()) {
            return chat_1.callCommand(intr, this, this.cmd);
        }
        if (intr.isContextMenu()) {
            return context_menu_1.callContextMenu(intr, this, this.cmd);
        }
    }
}
exports.Cell = Cell;
