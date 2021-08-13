"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const { Eq } = __1.DiceThresholdOp;
describe(__1.unparseDiceRoll, () => {
    it('stringifies count+faces (the required properties)', () => {
        expect(__1.unparseDiceRoll({ count: 1, faces: 6 })).toEqual('1d6');
    });
    it('stringifies positive offset', () => {
        expect(__1.unparseDiceRoll({ count: 1, faces: 6, offset: 4 })).toEqual('1d6 + 4');
    });
    it('stringifies negative offset', () => {
        expect(__1.unparseDiceRoll({ count: 1, faces: 6, offset: -4 })).toEqual('1d6 - 4');
    });
    it('stringifies threshold', () => {
        expect(__1.unparseDiceRoll({ count: 1, faces: 6, threshold: { op: Eq, value: 5 } })).toEqual('1d6 = 5');
    });
    it('stringifies threshold + offset', () => {
        expect(__1.unparseDiceRoll({ count: 1, faces: 6, offset: 4, threshold: { op: Eq, value: 5 } })).toEqual('1d6 + 4 = 5');
    });
});
