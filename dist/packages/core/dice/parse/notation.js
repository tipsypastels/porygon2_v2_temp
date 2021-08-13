"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchDiceNotation = void 0;
const COUNT = /(?<count>[1-9][0-9]*)?/;
const FACES = /(?:d(?<faces>[1-9][0-9]*))?/;
const OFFSET = /(?<offset>[+-]\d+)?/;
const BASE = new RegExp(`(?:${combine(COUNT, FACES, OFFSET)})?`);
const THRESHOLD_OP = /(?<tOp>=|!=|>|<|>=|<=)/;
const THRESHOLD_VALUE = /(?<tValue>\d+)/;
const THRESHOLD = new RegExp(`(?:${combine(THRESHOLD_OP, THRESHOLD_VALUE)})?`);
const FULL = new RegExp(`^${combine(BASE, THRESHOLD)}$`);
function combine(...args) {
    return args.map((r) => r.source).join('');
}
function matchDiceNotation(roll) {
    return FULL.exec(roll);
}
exports.matchDiceNotation = matchDiceNotation;
