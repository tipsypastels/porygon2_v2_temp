import './ascii';
import { Client, ClientOptions, Options } from 'discord.js';
import { createLogger, colors } from 'porygon/logger';
import { setupPlugins } from 'porygon/plugin/setup';
import { handleInteraction } from 'porygon/interaction';
import { setupAssets } from 'porygon/asset/setup';
import { uptime } from 'porygon/stats';
import { setupActivityMessages } from './activity';

const INVITE =
  'https://discord.com/oauth2/authorize?client_id={CLIENT_ID}&scope=bot+applications.commands&permissions=470019135';

const logger = createLogger('core', colors.blue);
const options: ClientOptions = {
  intents: [
    'GUILDS',
    'GUILD_BANS',
    'GUILD_EMOJIS_AND_STICKERS',
    'GUILD_MEMBERS',
    'GUILD_MESSAGES',
    'GUILD_PRESENCES',
  ],
  partials: ['USER', 'GUILD_MEMBER', 'MESSAGE', 'CHANNEL', 'REACTION'],
  makeCache: Options.cacheWithLimits({
    MessageManager: 400,
    GuildMemberManager: 400,
  }),
};

export class Porygon extends Client {
  constructor() {
    super(options);

    this.once('ready', async () => {
      await this.setup();

      uptime.startTiming();
      logger.info('Porygon is ready!');
    });

    this.on('interactionCreate', handleInteraction);
  }

  get inviteUrl() {
    const { user } = this;
    if (!user) throw new Error("Can't access Porygon#inviteUrl before ready.");

    return INVITE.replace('{CLIENT_ID}', user.id);
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
