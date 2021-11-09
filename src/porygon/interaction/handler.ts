import { Interaction } from 'discord.js';
import { getCommand } from 'porygon/commands';
import { logger } from 'porygon/logger';

export function handleInteraction(intr: Interaction) {
  if (intr.isCommand() || intr.isContextMenu()) {
    const command = getCommand(intr.commandId);

    if (!command) {
      logger.intr.error(`Got an interaction for unknown command: ${intr.commandName}.`);
      return;
    }

    return command.call(intr);
  }

  // buttons and selects are handled via collectors instead
  // but maybe more things will be here soon! :)
}
