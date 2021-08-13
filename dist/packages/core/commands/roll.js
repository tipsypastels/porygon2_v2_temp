"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Dice = __importStar(require("../dice"));
const roll = async ({ opts, embed, intr }) => {
    const roll = Dice.parseDiceRoll(opts.try('dice') ?? '');
    const notation = Dice.unparseDiceRoll(roll);
    const results = Dice.tallyDiceRoll(roll);
    embed.poryColor('info').setTitle(`Rolling ${notation}`).merge(results);
    await intr.reply({ embeds: [embed] });
};
roll.data = {
    name: 'roll',
    description: 'Rolls the dice!',
    options: [
        {
            name: 'dice',
            type: 'STRING',
            required: false,
            description: 'Dice notation for the roll. Will be 1d6 if omitted.',
        },
    ],
};
exports.default = roll;
