"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tallyDiceRoll = void 0;
const failure_percent_1 = require("porygon/stats/failure_percent");
const number_1 = require("support/number");
const dice_1 = require("./dice");
function tallyDiceRoll(roll) {
    const { threshold } = roll;
    const one = roll.count === 1;
    const values = [];
    const passFail = new failure_percent_1.FailurePercentStat();
    let total = 0;
    for (let i = 0; i < roll.count; i++) {
        const value = rollValue();
        total += value;
        if (threshold) {
            const passing = dice_1.diceThresholdPasses(threshold, value);
            passFail.add(passing);
            values.push(`**${value}** (${passing ? 'Pass' : 'Fail'})`);
        }
        else {
            values.push(`**${value}**`);
        }
    }
    function rollValue() {
        return number_1.randomIntInclusive(1, roll.faces) + (roll.offset ?? 0);
    }
    function intoEmbedValues(embed) {
        embed.setDescription(values.join(' + '));
    }
    function intoEmbedTotal(embed) {
        if (!one) {
            embed.addInlineField('Total', `${total}`);
        }
    }
    function intoEmbedThreshold(embed) {
        if (threshold && !one) {
            embed
                .addInlineField('Pass Threshold', `\\${threshold.op} ${threshold.value}`)
                .addInlineField('Passes', `${passFail.passes} / ${passFail.total}`);
        }
    }
    return function intoEmbed(embed) {
        embed.merge(intoEmbedValues).merge(intoEmbedTotal).merge(intoEmbedThreshold);
    };
}
exports.tallyDiceRoll = tallyDiceRoll;
