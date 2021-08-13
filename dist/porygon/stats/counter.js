"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterStat = void 0;
class CounterStat {
    constructor(_value = 0) {
        this._value = _value;
    }
    get value() {
        return this._value;
    }
    increment(by = 1) {
        this._value += by;
    }
}
exports.CounterStat = CounterStat;
