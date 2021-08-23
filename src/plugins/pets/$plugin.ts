import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init(config('guilds.pokecom').value);
export { default as COMMAND_pet } from './commands/pet';
export { default as EVENT_activate } from './events/activate';
