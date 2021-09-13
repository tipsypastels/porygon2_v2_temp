/**
 * Returns a random int between `min` and `max`, inclusive.
 */
export function randomIntInclusive(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random int between `min` and `max`, exclusive.
 */
export function randomIntExclusive(min: number, max: number) {
  return randomIntInclusive(min, max - 1);
}

/**
 * Clamps `num` to >=min and <=max.
 */
export function clamp(num: number, min: number, max: number) {
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

/**
 * Sums two numbers. Useful in `reduce`.
 */
export const sum = (a: number, b: number) => a + b;
