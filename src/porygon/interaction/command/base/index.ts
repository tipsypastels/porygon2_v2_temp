import { BaseCommandInteraction } from 'discord.js';
import { intrLogger } from '../../logger';
import { getCommand } from 'porygon/commands';

export * from './types';

export function handleBaseCommand(intr: BaseCommandInteraction) {
  const command = getCommand(intr.commandId);

  if (!command) {
    intrLogger.error(`Got an interaction for unknown command: ${intr.commandName}`);
    return;
  }

  return command.call(intr);
}
