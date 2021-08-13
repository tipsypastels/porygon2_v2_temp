"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInteraction = void 0;
const command_1 = require("./command");
function handleInteraction(intr) {
    if (intr.isCommand()) {
        return command_1.handleCommand(intr);
    }
    // buttons and selects are handled via collectors instead
    // but maybe more things will be here soon! :)
}
exports.handleInteraction = handleInteraction;
