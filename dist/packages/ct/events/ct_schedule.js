"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schedule_1 = require("porygon/schedule");
const impl_1 = require("../impl");
const ctSchedule = ({ events, kind, client }) => {
    const guild = kind.guild(client);
    if (guild) {
        events.on('messageCreate', impl_1.ctHandleMessage);
        schedule_1.schedule('cooltrainer.cycle', '0 0 * * 0', () => impl_1.ctRunCycle(guild));
    }
};
exports.default = ctSchedule;
