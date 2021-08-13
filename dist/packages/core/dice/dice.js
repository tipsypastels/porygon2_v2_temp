"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diceThresholdPasses = exports.DiceThresholdOp = exports.DEFAULT_DICE_ROLL = void 0;
exports.DEFAULT_DICE_ROLL = {
    faces: 6,
    count: 1,
};
var DiceThresholdOp;
(function (DiceThresholdOp) {
    DiceThresholdOp["Eq"] = "=";
    DiceThresholdOp["Gt"] = ">";
    DiceThresholdOp["Lt"] = "<";
    DiceThresholdOp["Ge"] = ">=";
    DiceThresholdOp["Le"] = "<=";
})(DiceThresholdOp = exports.DiceThresholdOp || (exports.DiceThresholdOp = {}));
function diceThresholdPasses({ op, value }, roll) {
    // prettier-ignore
    switch (op) {
        case DiceThresholdOp.Eq: return roll === value;
        case DiceThresholdOp.Gt: return roll > value;
        case DiceThresholdOp.Lt: return roll < value;
        case DiceThresholdOp.Ge: return roll >= value;
        case DiceThresholdOp.Le: return roll <= value;
    }
}
exports.diceThresholdPasses = diceThresholdPasses;
