import get from 'lodash.get';
import { Stringable } from 'support/string';
import { Lang, LangFn, Phrase, PluralMap } from './types';

/**
 * Creates a very simple lightweight i18n function. This need not be
 * used for all text, since Porygon doesn't really support non-English
 * at all, but it's useful for files with lots of strings and to avoid
 * gross pluralization gymnastics.
 *
 *     const lang = createLang(<const>{ hello: 'Hello!' })
 *     lang('hello') // => Hello!
 *
 * You can pass in any number of (potentially nested) strings and
 * access them in a path-style syntax.
 *
 * Parameters are supported and will be checked at compile time. In
 * order to make this work, the parameter to create lang *must* be
 * declared `<const>`.
 *
 *     const lang = createLang(<const>{ color: 'The color is {color}!' })
 *     lang('color', { color: 'red' }) // => The color is red!
 *
 * You can also pass in an object that represents multiple pluralization
 * states, preventing the need to manually pluralize. For example:
 *
 *     const lang = createLang(<const>{ friend:
 *       1: 'You have 1 new friend request.',
 *       _: 'You have {count} new friend requests.'
 *     });
 *
 *    lang('friend', { count: 1 }) // => You have 1 new friend request.
 *    lang('friend', { count: 2 }) // => You have 2 new friend requests.
 *
 * When using this feature the parameter `count` must always be provided,
 * even if none of the strings actually use it. In addition, you can provide
 * strings for any numbers, not just `1` and `_`, although that'll usually
 * be all that's needed.
 *
 * You can specify a non-root node of the lang tree. When doing this you must
 * pass in the union of the parameters of all their children. This can be
 * very useful with `Embed#mergeProps`.
 *
 *     const lang = createLang(<const>{
 *       success: {
 *         title: 'Deleted {subject} successfully.',
 *         description: 'Now back to {whatYouWereDoingBefore}.',
 *       },
 *     });
 *
 *     embed.mergeProps(lang('success', { subject: 'you', whatYouWereDoingBefore: 'oh' }));
 *
 */
export function createLang<L extends Lang>(lang: L): LangFn<L> {
  return function (...[path, params]) {
    const phrase = get(lang, path) as Phrase | Lang | undefined;

    if (!phrase) {
      throw new Error(`Unknown phrase path: ${path}`);
    }

    let ret: string | Lang;

    if (typeof phrase !== 'string' && '_' in phrase) {
      const { count } = params as any;
      ret = (phrase as PluralMap)[count in phrase ? count : '_'];
    } else {
      ret = phrase;
    }

    if (typeof ret === 'string') {
      return interp(ret, params);
    }

    return walk({ ...ret }) as any;

    function walk(item: string | Lang): string | Lang {
      if (typeof item === 'string') {
        return interp(item, params);
      }

      const itemDup = { ...item };

      for (const [key, value] of Object.entries(itemDup)) {
        itemDup[key] = walk(value);
      }

      return itemDup;
    }
  };
}

function interp(string: string, params?: Record<string, Stringable>) {
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      string = string.replace(`{${key}}`, value.toString());
    }
  }

  return string;
}
