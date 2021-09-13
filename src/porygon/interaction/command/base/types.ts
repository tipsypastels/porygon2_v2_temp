import {
  ApplicationCommandData as Data,
  BaseCommandInteraction,
  BaseCommandInteraction as Intr,
  Guild,
  GuildMember,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { PluginKind } from 'porygon/plugin';
import { Cell } from '../cell';

export interface BaseCommandArgs {
  author: GuildMember;
  guild: Guild;
  cell: Cell;
  intr: BaseCommandInteraction;
}

export type BaseCommandFn<A extends BaseCommandArgs> = (args: A) => Promise<void>;

interface PatchArgs {
  kind: PluginKind;
  client: Porygon;
}

export type BaseCommand<
  F extends BaseCommandFn<any> = BaseCommandFn<any>,
  D extends Data = Data,
> = F & {
  data: D;
  patchBeforeUpload?(data: D, args: PatchArgs): void;
  unknownErrorEphemerality?(...args: Parameters<F>): boolean;
};

export interface BaseCommandCallFn<C extends BaseCommand<any>, I extends Intr> {
  (intr: I, cell: Cell, cmd: C): void;
}

/**
 * A factory type (is that a term?) for creating types around commands.
 * All the types can be derived from `A` and `I`, so we just output them
 * as a single object type. The individual types can be re-exported with
 * local names too.
 */
export interface CreateBaseCommand<
  A extends BaseCommandArgs,
  I extends Intr,
  D extends Data,
> {
  Intr: I;
  Args: A;
  Data: D;
  Fn: BaseCommandFn<A>;
  Command: BaseCommand<this['Fn'], D>;
  CallFnArgs: [I, Cell, this['Command']];
  CallFn: (...args: [I, Cell, this['Command']]) => void;
}
