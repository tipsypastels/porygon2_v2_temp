import { PluginGuild } from 'porygon/plugin';
import { config } from 'porygon/config';

export default PluginGuild.init(config('guilds.pokecomstaf').value);
export { default as EVENT_pokecomstaf_logs } from './events/logs';
