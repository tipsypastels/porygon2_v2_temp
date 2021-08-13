/**
 * Fetches a random item from an array. If some alternate
 * randomness algorithm is desired it can be provided as the
 * second argument.
 */
export function random<T>(array: T[], rand = Math.random): T {
  return array[Math.floor(rand() * array.length)];
}

/**
 * Creates an iterator of tuples over multiple arrays.
 * If the arrays are different lengths, `zip` will stop at the length
 * of the shortest one.
 */
export function* zip<A, B>(a: A[], b: B[]): Generator<[A, B]> {
  const length = Math.min(a.length, b.length);

  for (let i = 0; i < length; i++) {
    yield [a[i], b[i]];
  }
}

/** Returns the first item of an array. */
export const first = <T>(array: T[]) => array[0];

/** Returns the last item of an array. */
export const last = <T>(array: T[]) => array[array.length - 1];

type ToSentenceOpts<T> = Partial<{
  twoWordConnector: string;
  wordConnector: string;
  finalWordConnector: string;
  convert(elem: T): string;
}>;

/**
 * Joins an array into an english sentence.
 */
export function toSentence<T>(
  array: T[],
  {
    twoWordConnector = ' and ',
    wordConnector = ', ',
    finalWordConnector = ', and ',
    convert = (elem: T) => `${elem}`,
  }: ToSentenceOpts<T> = {},
): string {
  switch (array.length) {
    case 0:
      return '';
    case 1:
      return convert(array[0]);
    case 2: {
      return `${convert(array[0])}${twoWordConnector}${convert(array[1])}`;
    }
    default: {
      const tail = convert(last(array));
      const main = array.slice(0, -1).map(convert).join(wordConnector);
      return `${main}${finalWordConnector}${tail}`;
    }
  }
}

/**
 * Converts an async iterator into an array.
 */
export async function arrayFromAsyncIter<T>(iter: AsyncIterable<T>) {
  const out: T[] = [];
  for await (const item of iter) out.push(item);
  return out;
}
