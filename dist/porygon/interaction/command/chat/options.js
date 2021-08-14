"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandOptions = void 0;
const object_fromentries_1 = __importDefault(require("object.fromentries"));
class CommandOptions {
    constructor(res) {
        this.res = res;
    }
    get(key) {
        return this.getValue(key, true);
    }
    try(key) {
        return this.getValue(key);
    }
    pick(...keys) {
        const values = keys.map((key) => [key, this.get(key)]);
        return object_fromentries_1.default(values);
    }
    getValue(key, required) {
        const option = this.res.get(key, required);
        if (!option) {
            return null;
        }
        switch (option.type) {
            case 'CHANNEL': {
                return option.channel;
            }
            case 'USER': {
                return option.member;
            }
            case 'ROLE': {
                return option.role;
            }
            default: {
                // note, we don't support mentionable via this system
                // nor subcommand/group since those have proper methods
                return option.value;
            }
        }
    }
    get subCommand() {
        return this.res.getSubcommand();
    }
    get subCommandGroup() {
        return this.res.getSubcommandGroup();
    }
}
exports.CommandOptions = CommandOptions;
