import { PluginGuilds } from 'porygon/plugin';
import { getGuildNamesWithFaqEntries } from './impl/faq_list';
import './impl/faq_list_data'; // ensure all created

export default PluginGuilds.init(...getGuildNamesWithFaqEntries());
export { default as COMMAND_faq_faq } from './commands/faq';
