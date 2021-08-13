import { create, all } from 'mathjs';
import fromEntries from 'object.fromentries';

const math = create(all);
export const evaluate = math.evaluate!.bind(math);

function disabled(fn: string) {
  return () => {
    throw new Error(`Function ${fn} is disabled.`);
  };
}

const UNSAFE_FNS = [
  'import',
  'createUnit',
  'evaluate',
  'parse',
  'simplify',
  'derivative',
];

math.import!(fromEntries(UNSAFE_FNS.map((f) => [f, disabled(f)])), { override: true });
