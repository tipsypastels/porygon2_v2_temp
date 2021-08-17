import { BaseCommandInteraction } from 'discord.js';
import { intrLogger } from '../../logger';
import { Plugin } from 'porygon/plugin';

export * from './factory';
export * from './types';

export function handleBaseCommand(intr: BaseCommandInteraction) {
  const command = Plugin.SAVED_COMMANDS.get(intr.commandId);

  if (!command) {
    intrLogger.error(`Got an interaction for unknown command: ${intr.commandName}`);
    return;
  }

  return command.call(intr);
}
