import { PluginGuilds } from 'porygon/plugin';
import './impl/faq_list_data'; // ensure all created

export default PluginGuilds.init('pokecom');
export { default as COMMAND_faq_faq } from './commands/faq';
