"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrapEnv = exports.DEV = void 0;
exports.DEV = process.env.NODE_ENV !== 'production';
/** @see EnvWrapper */
function unwrapEnv(wrapper) {
    if (typeof wrapper === 'object' && 'prod' in wrapper) {
        return wrapper[exports.DEV ? 'dev' : 'prod'];
    }
    return wrapper;
}
exports.unwrapEnv = unwrapEnv;
