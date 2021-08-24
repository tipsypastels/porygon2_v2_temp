import { Embed, IntoEmbedFnWith } from './embed';
import { Tail } from 'support/array';

type Fn = (embed: Embed, ...ctx: never[]) => void;
type Errors = {
  [key: string]: Fn;
};

type Context<E extends Errors, K extends keyof E> = Tail<Parameters<E[K]>>;

const TAG = Symbol('builtin-error');
const NO_EPH = /Pub$/;

export interface BuiltinError {
  [TAG]: true;
  code: string;
  ephemeral: boolean;
  intoEmbedWith: IntoEmbedFnWith<[string]>;
}

export function isBuiltinError(err: unknown): err is BuiltinError {
  return !!(err && typeof err === 'object' && TAG in err);
}

/**
 * Creates a function that throws errors specialized to a given command or context.
 * These errors translate to an `IntoEmbed` which will be caught by the command handler,
 * thus they should only be used where such a catch will be available, as they are
 * otherwise opaque objects.
 *
 * These errors are treated as ephemeral by default when caught. To make one non-ephemeral,
 * suffix the error code with `Pub`. The reason for this is to make it obvious both
 * when calling and defining (which may be far apart in long files).
 */
export function createBuiltinErrors<E extends Errors>(errors: E) {
  return <C extends keyof E & string>(code: C, ...ctx: Context<E, C>): BuiltinError => {
    const fn = errors[code];
    const ephemeral = !NO_EPH.exec(code);
    const visibleCode = code.replace(NO_EPH, '');

    const intoEmbedWith: BuiltinError['intoEmbedWith'] = (embed, cmd) => {
      embed.mergeWith(fn, ...ctx).setFooter(`Error Code: ${cmd}.${visibleCode}`);
    };

    return { [TAG]: true, code, ephemeral, intoEmbedWith };
  };
}
