/**
 * Returns a new set of items in either `a` or `b`.
 */
export function setUnion<A, B>(a: Set<A>, b: Set<B>) {
  return new Set([...a, ...b]);
}

/**
 * Returns a new set of items common to `a` and `b`.
 */
export function setIntersect<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => b.has(x)));
}

/**
 * Returns a new set of items in `a` that are not in `b`.
 */
export function setDiff<T>(a: Set<T>, b: Set<T>) {
  return new Set([...a].filter((x) => !b.has(x)));
}
