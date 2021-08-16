import { config } from 'porygon/config';
import { PluginGuild } from 'porygon/plugin/kind';

export default PluginGuild.init(config('guilds.duck').value);
