import { Cell } from './cell';
import {
  ApplicationCommandData as Data,
  BaseCommandInteraction,
  BaseCommandInteraction as Intr,
} from 'discord.js';
import { Package } from 'porygon/package';
import { intrLogger } from '../logger';

export type BaseCommandFn<A> = (args: A) => Promise<void>;

export type BaseCommand<F extends BaseCommandFn<any> = any> = F & {
  data: Data;
};

export interface BaseCommandCallFn<C extends BaseCommand<any>, I extends Intr> {
  (intr: I, cell: Cell, cmd: C): void;
}

export function handleBaseCommand(intr: BaseCommandInteraction) {
  const command = Package.SAVED_COMMANDS.get(intr.commandId);

  if (!command) {
    intrLogger.error(`Got an interaction for unknown command: ${intr.commandName}`);
    return;
  }

  return command.call(intr);
}
