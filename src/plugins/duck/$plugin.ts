import { PluginGuild } from 'porygon/plugin';

export default PluginGuild.init('duck');
export { default as COMMAND_duck_8ball } from './commands/8ball';
export { default as COMMAND_duck_hug } from './commands/hug';
export { default as COMMAND_duck_inky } from './commands/inky';
export { default as COMMAND_duck_nudge } from './commands/nudge';
export { default as COMMAND_duck_pat } from './commands/pat';
export { default as COMMAND_duck_thanos } from './commands/thanos';
export { default as COMMAND_duck_vibe } from './commands/vibe';
export { default as COMMAND_duck_experiment } from './commands/experiment';
export { default as EVENT_duck_joinMessage } from './events/join_message';
export { default as EVENT_duck_camelReact } from './events/camel_react';
