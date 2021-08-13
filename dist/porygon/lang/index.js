"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLang = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
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
 */
function createLang(lang) {
    return function (...[path, params]) {
        const phrase = lodash_get_1.default(lang, path);
        let phraseString = resolvePhraseString(phrase, () => params.count);
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                phraseString = phraseString.replace(`{${key}}`, value);
            }
        }
        return phraseString;
    };
}
exports.createLang = createLang;
function resolvePhraseString(phrase, getCount) {
    if (typeof phrase === 'string') {
        return phrase;
    }
    // lazy because strings don't have a .count,
    // so we'd rather not uncritically pass it in
    // (even if it technically wouldn't blow up in pure js)
    const count = getCount();
    return phrase[count in phrase ? count : '_'];
}
