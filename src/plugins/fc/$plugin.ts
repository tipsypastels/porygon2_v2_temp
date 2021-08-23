import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init(config('guilds.pokecom').value);
export { default as COMMAND_fc_fc } from './commands/fc';
