import { PluginGuilds } from 'porygon/plugin';
import { config } from 'porygon/config';

export default PluginGuilds.init([
  config('guilds.pokecom').value,
  config('guilds.pokecomstaf').value,
]);
export { default as COMMAND_role_rolemod } from './commands/rolemod';
export { default as COMMAND_role_role } from './commands/role';
