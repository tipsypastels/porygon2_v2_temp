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
exports.tallyDiceRoll = exports.unparseDiceRoll = exports.parseDiceRoll = void 0;
__exportStar(require("./dice"), exports);
var parse_1 = require("./parse");
Object.defineProperty(exports, "parseDiceRoll", { enumerable: true, get: function () { return parse_1.parseDiceRoll; } });
Object.defineProperty(exports, "unparseDiceRoll", { enumerable: true, get: function () { return parse_1.unparseDiceRoll; } });
var tally_1 = require("./tally");
Object.defineProperty(exports, "tallyDiceRoll", { enumerable: true, get: function () { return tally_1.tallyDiceRoll; } });
