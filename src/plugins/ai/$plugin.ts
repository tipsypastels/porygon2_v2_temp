import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init(config('guilds.duck').value);
export { default as COMMAND_ai_pory } from './commands/pory';
