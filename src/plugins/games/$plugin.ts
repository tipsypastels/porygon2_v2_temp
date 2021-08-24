import { config } from 'porygon/config';
import { PluginGuilds } from 'porygon/plugin/kind';

export default PluginGuilds.init([
  config('guilds.duck').value,
  config('guilds.pokecomstaf').value,
]);
export { default as COMMAND_games_hangman } from './commands/hangman';
