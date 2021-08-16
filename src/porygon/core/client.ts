import './ascii';
import { Client } from 'discord.js';
import { createLogger, colors } from 'porygon/logger';
import { intents } from './intents';
import { setupPlugins } from 'porygon/plugin/setup';
import { handleInteraction } from 'porygon/interaction';
import { setupAssets } from 'porygon/asset/setup';
import { uptime } from 'porygon/stats';
import { setupActivityMessages } from './activity';

const logger = createLogger('core', colors.blue);

export class Porygon extends Client {
  constructor() {
    super({ intents });

    this.once('ready', async () => {
      await this.setup();

      uptime.startTiming();
      logger.info('Porygon is ready!');
    });

    this.on('interactionCreate', handleInteraction);
  }

  private setup() {
    return Promise.all([
      setupPlugins(this),
      setupAssets(this),
      setupActivityMessages(this),
    ]).catch((e) => {
      logger.error(e);
      logger.error('Setup failed.');
      process.exit(1);
    });
  }
}
