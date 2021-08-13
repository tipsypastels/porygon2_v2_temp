"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDiceRoll = void 0;
const number_1 = require("support/number");
const string_1 = require("support/string");
const dice_1 = require("../dice");
const notation_1 = require("./notation");
const parse_error_1 = require("./parse_error");
function parseDiceRoll(roll) {
    roll = string_1.stripSpaces(roll);
    if (roll.length === 0) {
        return dice_1.DEFAULT_DICE_ROLL;
    }
    const match = notation_1.matchDiceNotation(roll);
    if (!match) {
        return parse_error_1.diceParseError(roll);
    }
    const groups = match.groups;
    const result = {};
    function set(key, value) {
        result[key] = value;
    }
    set('count', number_1.clamp(+(groups.count ?? 1), 1, 100));
    set('faces', number_1.clamp(+(groups.faces ?? 6), 1, 100));
    if (groups.offset) {
        set('offset', number_1.clamp(+groups.offset, -100, 100));
    }
    if (groups.tOp) {
        set('threshold', { op: groups.tOp, value: +groups.tValue });
    }
    return result;
}
exports.parseDiceRoll = parseDiceRoll;
