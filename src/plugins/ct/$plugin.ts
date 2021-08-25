import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init('pokecom');
export { default as COMMAND_ct_cooltrainer } from './commands/cooltrainer';
export { default as EVENT_ct_ctSchedule } from './events/ct_schedule';
