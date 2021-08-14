"use strict";
/**
 * A rundown of the error system.
 *
 * Because embeds are near universal in Porygon, and often used for passing
 * messages between different parts of the system to collectively build up
 * the final user output, many Porygon functions, especially those related
 * to commands, will throw an "embedded error" - an error which is really
 * just an `IntoEmbed`.
 *
 * This embed will be caught by command handlers (and anywhere else that
 * might need it) and identified using the `isEmbeddedError` predicate.
 * From there, it can just be merged into an embed as any output would.
 *
 * The `embeddedError` function can be used directly, or indirectly via
 * factories like `embeddedError.warn`, which layer on common shared UI
 * such as warning colours and thumbnails.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddedError = exports.isEmbeddedError = void 0;
const TAG = Symbol('embeddedError');
function isEmbeddedError(error) {
    return !!(error && typeof error === 'object' && TAG in error);
}
exports.isEmbeddedError = isEmbeddedError;
/**
 * Creates an embedded error. Try to use `embeddedError.warn`, `embeddedError.danger`,
 * or `embeddedError.error` when possible, as it's best to standardize these things,
 * and they still let you customize nearly as much.
 *
 * This function can be used for completely custom error embeds if needed.
 */
function embeddedError(fn, { ephemeral = false } = {}) {
    return { [TAG]: true, intoEmbed: fn, ephemeral };
}
exports.embeddedError = embeddedError;
/**
 * Warnings should be used for non-malicious and non-critical errors. Examples:
 *
 *     - Malformed parameters
 *     - No such item
 *     - Nothing to do
 */
embeddedError.warn = function (fn) {
    return embeddedError((e) => e.merge(WARN).merge(fn));
};
/**
 * @see embeddedError.warn
 */
embeddedError.warnEph = function (fn) {
    return embeddedError((e) => e.merge(WARN).merge(fn), { ephemeral: true });
};
/**
 * Danger should be used for non-critical errors where the user is probably
 * trying to do something weird or unsupported on purpose. Examples:
 *
 *     - Can't remove another user's pets
 *     - Can't request the moderoid role
 */
embeddedError.danger = function (fn) {
    return embeddedError((e) => e.merge(DANGER).merge(fn));
};
/**
 * @see embeddedError.danger
 */
embeddedError.dangerEph = function (fn) {
    return embeddedError((e) => e.merge(DANGER).merge(fn), { ephemeral: true });
};
/**
 * Error should be used for critical errors, whether user-caused or not. Critical errors
 * are those where it is probably not possible to give the user an explanation of what
 * they did wrong or tell them to try again. Examples:
 *
 *     - Command handler threw
 *     - Service unavailable
 */
embeddedError.error = function (fn) {
    return embeddedError((e) => e.merge(ERROR).merge(fn));
};
/**
 * @see embeddedError.error
 */
embeddedError.errorEph = function (fn) {
    return embeddedError((e) => e.merge(ERROR).merge(fn), { ephemeral: true });
};
const WARN = (e) => e.poryThumb('warning').poryColor('warning');
const DANGER = (e) => e.poryThumb('danger').poryColor('danger');
const ERROR = (e) => e.poryThumb('error').poryColor('error');
