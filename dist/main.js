"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./porygon/core");
const client = new core_1.Porygon();
client.login(process.env.TOKEN);
