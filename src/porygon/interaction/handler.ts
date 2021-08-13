import { Interaction } from 'discord.js';
import { handleBaseCommand } from './command';

export function handleInteraction(intr: Interaction) {
  if (intr.isCommand() || intr.isContextMenu()) {
    handleBaseCommand(intr);
  }

  // buttons and selects are handled via collectors instead
  // but maybe more things will be here soon! :)
}
