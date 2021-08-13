"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_1 = require("./array");
describe(array_1.random, () => {
    it('outputs a random number in range', () => {
        const ary = [1, 2, 3, 4, 5];
        expect(ary).toContain(array_1.random(ary));
    });
});
describe(array_1.zip, () => {
    it('zips two arrays together', () => {
        const a1 = [1, 2, 3];
        const a2 = [4, 5, 6];
        expect(Array.from(array_1.zip(a1, a2))).toEqual([
            [1, 4],
            [2, 5],
            [3, 6],
        ]);
    });
    it('stops at the length of the shortest array', () => {
        const a1 = [1, 2, 3];
        const a2 = [4, 5];
        expect(Array.from(array_1.zip(a1, a2))).toEqual([
            [1, 4],
            [2, 5],
        ]);
    });
    it('yields nothing for an empty array', () => {
        const a1 = [1, 2, 3];
        const a2 = [];
        expect(Array.from(array_1.zip(a1, a2))).toEqual([]);
    });
});
describe(array_1.first, () => {
    it('returns the first item of an array', () => {
        expect(array_1.first([1, 2, 3])).toBe(1);
    });
    it('returns undefined for empty array', () => {
        expect(array_1.first([])).toBe(undefined);
    });
});
describe(array_1.last, () => {
    it('returns the last item of an array', () => {
        expect(array_1.last([1, 2, 3])).toBe(3);
    });
    it('returns undefined for empty array', () => {
        expect(array_1.last([])).toBe(undefined);
    });
});
describe(array_1.toSentence, () => {
    it('joins terms into a sentence', () => {
        expect(array_1.toSentence(['a', 'b', 'c'])).toBe('a, b, and c');
    });
    it('uses and to join two terms', () => {
        expect(array_1.toSentence(['a', 'b'])).toBe('a and b');
    });
    it('does not change a single term', () => {
        expect(array_1.toSentence(['a'])).toBe('a');
    });
    it('returns an empty string for none', () => {
        expect(array_1.toSentence([])).toBe('');
    });
});
