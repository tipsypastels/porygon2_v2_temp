"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const range_1 = require("./range");
describe(range_1.InclusiveRange, () => {
    it('stringifies as min..max', () => {
        expect(new range_1.InclusiveRange(5, 10).toString()).toEqual('5..10');
    });
    it('converts to an array, including the final element', () => {
        expect(new range_1.InclusiveRange(5, 10).toArray()).toEqual([5, 6, 7, 8, 9, 10]);
    });
    it('yields the final element', () => {
        const out = [];
        for (const item of new range_1.InclusiveRange(5, 10)) {
            out.push(item);
        }
        expect(out).toEqual([5, 6, 7, 8, 9, 10]);
    });
});
describe(range_1.ExclusiveRange, () => {
    it('stringifies as min...max', () => {
        expect(new range_1.ExclusiveRange(5, 10).toString()).toEqual('5...10');
    });
    it('converts to an array, not including the final element', () => {
        expect(new range_1.ExclusiveRange(5, 10).toArray()).toEqual([5, 6, 7, 8, 9]);
    });
    it('yields the final element', () => {
        const out = [];
        for (const item of new range_1.ExclusiveRange(5, 10)) {
            out.push(item);
        }
        expect(out).toEqual([5, 6, 7, 8, 9]);
    });
});
