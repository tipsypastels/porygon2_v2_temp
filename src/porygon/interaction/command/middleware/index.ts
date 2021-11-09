import { Executor, Outcome, Ambience } from '../base';

export const MIDDLEWARE_BREAK: unique symbol = Symbol('MIDDLEWARE_BREAK');

type Fn<A extends any[]> = (...args: A) => Promise<Ret>;
type Ret = typeof MIDDLEWARE_BREAK | void;

export interface MiddlewareClass<M extends Ambience> {
  new (exec: Executor<M>, args: M['Args']): Middleware;
}

export interface Middleware {
  before?: Fn<[]>;
  after?: Fn<[Outcome]>;
}

export interface RunOpts<M extends Ambience> {
  exec: Executor<M>;
  args: M['Args'];
  do: () => Promise<Outcome>;
}

export async function runMiddleware<A extends Ambience>(opts: RunOpts<A>) {
  const middleware = opts.exec.middleware.map((x) => new x(opts.exec, opts.args));
  await runLine(middleware, (m) => m.before?.());

  const result = await opts.do();
  await runLine(middleware, (m) => m.after?.(result));
}

async function runLine<T>(items: T[], call: (t: T) => Promise<Ret> | undefined) {
  for (const item of items) {
    const then = await call(item);
    if (then === MIDDLEWARE_BREAK) break;
  }
}
