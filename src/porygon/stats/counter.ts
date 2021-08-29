export class CounterStat {
  static table<N extends string>(names: readonly N[], value = 0) {
    const table: Partial<Record<N, CounterStat>> = {};

    for (const name of names) {
      table[name] = new CounterStat(value);
    }

    return table as Record<N, CounterStat>;
  }

  constructor(private _value = 0) {}

  get value() {
    return this._value;
  }

  increment(by = 1) {
    this._value += by;
  }

  toString() {
    return `${this.value}`;
  }
}
