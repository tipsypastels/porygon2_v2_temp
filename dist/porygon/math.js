"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluate = void 0;
const mathjs_1 = require("mathjs");
const object_fromentries_1 = __importDefault(require("object.fromentries"));
const math = mathjs_1.create(mathjs_1.all);
exports.evaluate = math.evaluate.bind(math);
function disabled(fn) {
    return () => {
        throw new Error(`Function ${fn} is disabled.`);
    };
}
const UNSAFE_FNS = [
    'import',
    'createUnit',
    'evaluate',
    'parse',
    'simplify',
    'derivative',
];
math.import(object_fromentries_1.default(UNSAFE_FNS.map((f) => [f, disabled(f)])), { override: true });
