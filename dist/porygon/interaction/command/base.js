"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleBaseCommand = void 0;
const package_1 = require("porygon/package");
const logger_1 = require("../logger");
function handleBaseCommand(intr) {
    const command = package_1.Package.SAVED_COMMANDS.get(intr.commandId);
    if (!command) {
        logger_1.intrLogger.error(`Got an interaction for unknown command: ${intr.commandName}`);
        return;
    }
    return command.call(intr);
}
exports.handleBaseCommand = handleBaseCommand;
