"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommand = void 0;
const package_1 = require("porygon/package/package");
const logger_1 = require("../logger");
__exportStar(require("./command"), exports);
__exportStar(require("./groups"), exports);
__exportStar(require("./reference"), exports);
function handleCommand(intr) {
    const command = package_1.Package.SAVED_COMMANDS.get(intr.commandId);
    if (!command) {
        logger_1.intrLogger.error(`Got an interaction for unknown command: ${intr.commandName}`);
        return;
    }
    return command.call(intr);
}
exports.handleCommand = handleCommand;
