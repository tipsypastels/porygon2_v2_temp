import { BaseCommandInteraction } from 'discord.js';
import { getCommand } from 'porygon/commands';
import { logger } from 'porygon/logger';

export * from './types';

export function handleBaseCommand(intr: BaseCommandInteraction) {
  const command = getCommand(intr.commandId);

  if (!command) {
    logger.intr.error(`Got an interaction for unknown command: ${intr.commandName}`);
    return;
  }

  return command.call(intr);
}
