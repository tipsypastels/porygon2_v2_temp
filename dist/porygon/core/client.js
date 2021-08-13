"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Porygon = void 0;
const discord_js_1 = require("discord.js");
const logger_1 = require("porygon/logger");
const intents_1 = require("./intents");
require("./ascii");
const setup_1 = require("porygon/package/setup");
const interaction_1 = require("porygon/interaction");
const setup_2 = require("porygon/asset/setup");
const stats_1 = require("porygon/stats");
const logger = logger_1.createLogger('core', logger_1.colors.blue);
class Porygon extends discord_js_1.Client {
    constructor() {
        super({ intents: intents_1.intents });
        this.once('ready', async () => {
            await this.setup();
            logger.info('Porygon is ready!');
        });
        this.on('interactionCreate', interaction_1.handleInteraction);
    }
    setup() {
        return Promise.all([
            setup_1.setupPackages(this),
            setup_2.setupAssets(this),
            stats_1.uptime.startTiming(),
        ]).catch((e) => {
            logger.error(e);
            logger.error('Setup failed.');
            process.exit(1);
        });
    }
}
exports.Porygon = Porygon;
