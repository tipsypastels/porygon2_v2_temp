"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unparseDiceRoll = void 0;
function unparseDiceRoll(roll) {
    let base = `${roll.count}d${roll.faces}`;
    if (roll.offset && roll.offset > 0)
        base += ` + ${roll.offset}`;
    if (roll.offset && roll.offset < 0)
        base += ` - ${Math.abs(roll.offset)}`;
    if (roll.threshold)
        base += ` ${roll.threshold.op} ${roll.threshold.value}`;
    return base;
}
exports.unparseDiceRoll = unparseDiceRoll;
