import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init(config('guilds.pokecom').value);
export { default as COMMAND_cooltrainer } from './commands/cooltrainer';
export { default as EVENT_ctSchedule } from './events/ct_schedule';
