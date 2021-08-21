import { Collection, Snowflake } from 'discord.js';
import { Cell } from 'porygon/interaction';

const SAVED_COMMANDS = new Collection<Snowflake, Cell>();

export function getCommand(id: string) {
  return SAVED_COMMANDS.get(id);
}

export function searchCommands(cb: (cell: Cell) => boolean) {
  return SAVED_COMMANDS.find(cb);
}

export function saveCommand(cell: Cell) {
  SAVED_COMMANDS.set(cell.id, cell);
}
