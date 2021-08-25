import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init('pokecom');
export { default as COMMAND_pokecom_rolelist } from './commands/rolelist';
export { default as EVENT_pokecom_logs } from './events/logs';
export { default as EVENT_pokecom_shim } from './events/shim';
