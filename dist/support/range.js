"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExclusiveRange = exports.InclusiveRange = exports.Range = void 0;
const number_1 = require("./number");
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    *[Symbol.iterator]() {
        for (let i = this.start; i < this.bound; i++) {
            yield i;
        }
    }
    forEach(callback) {
        for (const index of this) {
            callback(index);
        }
    }
    map(callback) {
        const out = [];
        for (const index of this) {
            out.push(callback(index));
        }
        return out;
    }
    toArray() {
        return Array.from(this);
    }
    random() {
        return number_1.randomIntExclusive(this.start, this.bound);
    }
}
exports.Range = Range;
class InclusiveRange extends Range {
    get bound() {
        return this.end + 1;
    }
    toString() {
        return `${this.start}..${this.end}`;
    }
}
exports.InclusiveRange = InclusiveRange;
class ExclusiveRange extends Range {
    get bound() {
        return this.end;
    }
    toString() {
        return `${this.start}...${this.end}`;
    }
}
exports.ExclusiveRange = ExclusiveRange;
