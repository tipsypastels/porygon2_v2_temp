"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clamp = exports.randomIntExclusive = exports.randomIntInclusive = void 0;
/**
 * Returns a random int between `min` and `max`, inclusive.
 */
function randomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomIntInclusive = randomIntInclusive;
/**
 * Returns a random int between `min` and `max`, exclusive.
 */
function randomIntExclusive(min, max) {
    return randomIntInclusive(min, max - 1);
}
exports.randomIntExclusive = randomIntExclusive;
/**
 * Clamps `num` to >=min and <=max.
 */
function clamp(num, min, max) {
    if (num < min)
        return min;
    if (num > max)
        return max;
    return num;
}
exports.clamp = clamp;
