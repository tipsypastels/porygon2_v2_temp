import { randomIntExclusive } from './number';

export abstract class Range {
  constructor(readonly start: number, readonly end: number) {}

  abstract toString(): string;
  protected abstract bound: number;

  *[Symbol.iterator]() {
    for (let i = this.start; i < this.bound; i++) {
      yield i;
    }
  }

  forEach(callback: (index: number) => void) {
    for (const index of this) {
      callback(index);
    }
  }

  map<R>(callback: (index: number) => R) {
    const out: R[] = [];

    for (const index of this) {
      out.push(callback(index));
    }

    return out;
  }

  toArray() {
    return Array.from(this);
  }

  random() {
    return randomIntExclusive(this.start, this.bound);
  }
}

export class InclusiveRange extends Range {
  protected get bound() {
    return this.end + 1;
  }

  toString() {
    return `${this.start}..${this.end}`;
  }
}

export class ExclusiveRange extends Range {
  protected get bound() {
    return this.end;
  }

  toString() {
    return `${this.start}...${this.end}`;
  }
}
