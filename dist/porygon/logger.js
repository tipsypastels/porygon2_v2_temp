"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupLogger = exports.bugLogger = exports.createLogger = exports.colors = void 0;
const colors_1 = __importDefault(require("colors"));
exports.colors = colors_1.default;
const strftime_1 = __importDefault(require("strftime"));
const dev_1 = require("./dev");
function createLogger(name, color) {
    function createHeader(level) {
        const nameText = color(name);
        const levelColor = COLORS[level];
        return `${levelColor(`${level}(`)}${nameText}${levelColor(')')}`;
    }
    function log(level, message) {
        if (!message) {
            return;
        }
        if (typeof message !== 'string') {
            message = message.stack;
        }
        const ts = createTimestamp();
        const header = createHeader(level);
        console.log(`${ts} ${header} ${message}`);
    }
    const error = (m) => log('error', m);
    const warn = (m) => log('warn', m);
    const info = (m) => log('info', m);
    const debug = (m) => dev_1.DEV && log('debug', m);
    return { error, warn, info, debug };
}
exports.createLogger = createLogger;
function createTimestamp() {
    return colors_1.default.gray(strftime_1.default('%H:%M'));
}
const COLORS = {
    error: colors_1.default.red,
    warn: colors_1.default.yellow,
    info: colors_1.default.blue,
    debug: colors_1.default.bgMagenta,
};
// shared loggers
exports.bugLogger = createLogger('bug', colors_1.default.bgRed);
exports.setupLogger = createLogger('setup', colors_1.default.green);
