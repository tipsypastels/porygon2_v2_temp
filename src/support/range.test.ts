import { InclusiveRange as IR, ExclusiveRange as ER } from './range';

describe(IR, () => {
  it('stringifies as min..max', () => {
    expect(new IR(5, 10).toString()).toEqual('5..10');
  });

  it('converts to an array, including the final element', () => {
    expect(new IR(5, 10).toArray()).toEqual([5, 6, 7, 8, 9, 10]);
  });

  it('yields the final element', () => {
    const out = [];

    for (const item of new IR(5, 10)) {
      out.push(item);
    }

    expect(out).toEqual([5, 6, 7, 8, 9, 10]);
  });
});

describe(ER, () => {
  it('stringifies as min...max', () => {
    expect(new ER(5, 10).toString()).toEqual('5...10');
  });

  it('converts to an array, not including the final element', () => {
    expect(new ER(5, 10).toArray()).toEqual([5, 6, 7, 8, 9]);
  });

  it('yields the final element', () => {
    const out = [];

    for (const item of new ER(5, 10)) {
      out.push(item);
    }

    expect(out).toEqual([5, 6, 7, 8, 9]);
  });
});
