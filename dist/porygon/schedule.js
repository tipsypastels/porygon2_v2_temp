"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedule = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const logger_1 = require("./logger");
const logger = logger_1.createLogger('task', logger_1.red);
function schedule(name, time, fn) {
    logger.info(`Task scheduled: ${name} at ${time}`);
    node_cron_1.default.schedule(time, () => {
        logger.info(`Task starting: ${name}`);
        fn();
    });
}
exports.schedule = schedule;
