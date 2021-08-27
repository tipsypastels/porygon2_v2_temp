import { Collection } from 'discord.js';
import fromEntries from 'object.fromentries';

export class CounterStat {
  constructor(private _value = 0) {}

  get value() {
    return this._value;
  }

  increment(by = 1) {
    this._value += by;
  }
}

export class CounterTableStat<N extends string> {
  private counters: Collection<N, number>;

  constructor(...names: N[]) {
    this.counters = new Collection();
    names.forEach((name) => this.counters.set(name, 0));
  }

  value(name: N) {
    return this.counters.get(name)!;
  }

  increment(name: N, by = 1) {
    this.counters.set(name, this.counters.get(name)! + by);
  }

  flatten() {
    return fromEntries(this.counters.entries()) as Record<N, number>;
  }
}
