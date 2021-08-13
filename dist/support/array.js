"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFromAsyncIter = exports.toSentence = exports.last = exports.first = exports.zip = exports.random = void 0;
/**
 * Fetches a random item from an array. If some alternate
 * randomness algorithm is desired it can be provided as the
 * second argument.
 */
function random(array, rand = Math.random) {
    return array[Math.floor(rand() * array.length)];
}
exports.random = random;
/**
 * Creates an iterator of tuples over multiple arrays.
 * If the arrays are different lengths, `zip` will stop at the length
 * of the shortest one.
 */
function* zip(a, b) {
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i++) {
        yield [a[i], b[i]];
    }
}
exports.zip = zip;
/** Returns the first item of an array. */
const first = (array) => array[0];
exports.first = first;
/** Returns the last item of an array. */
const last = (array) => array[array.length - 1];
exports.last = last;
/**
 * Joins an array into an english sentence.
 */
function toSentence(array, { twoWordConnector = ' and ', wordConnector = ', ', finalWordConnector = ', and ', convert = (elem) => `${elem}`, } = {}) {
    switch (array.length) {
        case 0:
            return '';
        case 1:
            return convert(array[0]);
        case 2: {
            return `${convert(array[0])}${twoWordConnector}${convert(array[1])}`;
        }
        default: {
            const tail = convert(exports.last(array));
            const main = array.slice(0, -1).map(convert).join(wordConnector);
            return `${main}${finalWordConnector}${tail}`;
        }
    }
}
exports.toSentence = toSentence;
/**
 * Converts an async iterator into an array.
 */
async function arrayFromAsyncIter(iter) {
    const out = [];
    for await (const item of iter)
        out.push(item);
    return out;
}
exports.arrayFromAsyncIter = arrayFromAsyncIter;
