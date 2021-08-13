"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
describe(__1.parseDiceRoll, () => {
    it('returns the default case for an empty string', () => {
        expect(__1.parseDiceRoll('')).toEqual(__1.DEFAULT_DICE_ROLL);
    });
    it('returns the default case for a blank non-empty string', () => {
        expect(__1.parseDiceRoll(' ')).toEqual(__1.DEFAULT_DICE_ROLL);
    });
    it('parses a bare number as the number of dice', () => {
        expect(__1.parseDiceRoll('2')).toEqual({ count: 2, faces: 6 });
    });
    it('parses {x}d{y] as {count}d{faces}', () => {
        expect(__1.parseDiceRoll('2d4')).toEqual({ count: 2, faces: 4 });
    });
    it('supports faces without count', () => {
        expect(__1.parseDiceRoll('d4')).toEqual({ count: 1, faces: 4 });
    });
    it('ignores spaces altogether', () => {
        expect(__1.parseDiceRoll('2   d   4')).toEqual({ count: 2, faces: 4 });
    });
    it('supports positive offsets', () => {
        expect(__1.parseDiceRoll('2d4+6')).toEqual({ count: 2, faces: 4, offset: 6 });
    });
    it('supports negative offsets', () => {
        expect(__1.parseDiceRoll('2d4-6')).toEqual({ count: 2, faces: 4, offset: -6 });
    });
    it('supports offsets without faces', () => {
        expect(__1.parseDiceRoll('2+4')).toEqual({ count: 2, faces: 6, offset: 4 });
    });
    it('supports offsets alone', () => {
        expect(__1.parseDiceRoll('+4')).toEqual({ count: 1, faces: 6, offset: 4 });
    });
    for (const op of ['=', '>', '<', '>=', '<=']) {
        it(`supports op ${op}`, () => {
            expect(__1.parseDiceRoll(`1d4${op}5`)).toEqual({
                count: 1,
                faces: 4,
                threshold: { op, value: 5 },
            });
        });
    }
    it('supports ops alone', () => {
        expect(__1.parseDiceRoll('=5')).toEqual({ count: 1, faces: 6, threshold: { op: '=', value: 5 } });
    });
});
