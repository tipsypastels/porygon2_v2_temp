"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSnowflake = void 0;
/** @see SnowflakeLike */
function resolveSnowflake(like) {
    return typeof like === 'string' ? like : like.id;
}
exports.resolveSnowflake = resolveSnowflake;
