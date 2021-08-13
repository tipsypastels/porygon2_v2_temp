"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("porygon/config");
const URL = config_1.config('pkg.pokecom.role_list_url');
const rolelist = async ({ intr }) => {
    await intr.reply({
        content: `[You can see a list of requestable roles here :)](${URL.value})`,
        ephemeral: true,
    });
};
rolelist.data = {
    name: 'rolelist',
    description: 'Provides a link to a list of roles.',
};
exports.default = rolelist;
