"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractOnlyKey = void 0;
const util_1 = require("util");
/**
 * Extracts the only key of `obj`. Throws if there are zero or many keys.
 */
function extractOnlyKey(obj) {
    const keys = Object.keys(obj);
    if (keys.length === 0) {
        throw new Error('extractOnlyKey: Failed on empty object.');
    }
    if (keys.length > 1) {
        throw new Error(`extractOnlyKey: Got multiple keys: ${util_1.inspect(keys)}.`);
    }
    return keys[0];
}
exports.extractOnlyKey = extractOnlyKey;
