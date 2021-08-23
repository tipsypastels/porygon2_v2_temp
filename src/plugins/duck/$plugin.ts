import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init(config('guilds.duck').value);
export { default as COMMAND_8ball } from './commands/8ball';
export { default as COMMAND_hug } from './commands/hug';
export { default as COMMAND_inky } from './commands/inky';
export { default as COMMAND_nudge } from './commands/nudge';
export { default as COMMAND_pat } from './commands/pat';
export { default as COMMAND_thanos } from './commands/thanos';
export { default as COMMAND_vibe } from './commands/vibe';
export { default as EVENT_joinMessage } from './events/join_message';
