import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin/kind';

export default PluginGuild.init(config('guilds.duck').value);
export { default as COMMAND_games_experiment } from './commands/experiment';
export { default as COMMAND_games_hangman } from './commands/hangman';
