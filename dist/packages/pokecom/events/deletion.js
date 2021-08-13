"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_logging_1 = require("packages/_shared/event_logging");
const config_1 = require("porygon/config");
const LOG_CHANNEL_ID = config_1.config('pkg.pokecom.logging.log_channel');
const handler = ({ events }) => {
    event_logging_1.logDeletions(events, { logTo: LOG_CHANNEL_ID, verbosity: 'verbose' });
};
exports.default = handler;
