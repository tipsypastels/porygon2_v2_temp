"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const impl_1 = require("../impl");
const activate = ({ events }) => {
    events.on('guildMemberAdd', impl_1.activatePetsBy).on('guildMemberRemove', impl_1.deactivatePetsBy);
};
exports.default = activate;
