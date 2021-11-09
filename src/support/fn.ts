/** The type of any function. */
export type AnyFn = (...args: any[]) => any;

/** The type of any function returning `R`. */
export type AnyFnRet<R> = (...args: any[]) => R;

/** Turns an abstract class type into a regular class type. */
export type Concrete<A extends abstract new (...args: any[]) => any> =
  A extends abstract new (...args: infer A) => infer R ? new (...args: A) => R : never;

export function noop() {
  // does nothing
}

export async function asyncNoop() {
  // does nothing
}
