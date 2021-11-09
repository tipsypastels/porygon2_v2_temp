import {
  BaseCommandInteraction as BaseIntr,
  ApplicationCommandData as BaseData,
  Guild,
  GuildMember,
} from 'discord.js';
import { Porygon } from 'porygon/core';
import { Embed } from 'porygon/embed';
import { Cell } from 'porygon/interaction';
import { logger } from 'porygon/logger';
import { PluginKind } from 'porygon/plugin';
import { MiddlewareClass, runMiddleware } from '../middleware';

export interface BaseArgs<I extends BaseIntr> {
  client: Porygon;
  author: GuildMember;
  guild: Guild;
  cell: Cell;
  intr: I;
  embed: Embed;
}

interface PatchCtx {
  kind: PluginKind;
  client: Porygon;
}

export interface BaseCommandFn<M extends Ambience = Ambience> {
  (args: M['Args']): Promise<void>;
}

export interface BaseCommand<M extends Ambience = Ambience, D extends BaseData = BaseData>
  extends BaseCommandFn<M> {
  data: D;

  patchBeforeUpload?(data: any, ctx: PatchCtx): void;
  unknownErrorEphemerality?(args: M['Args']): boolean;
}

export type Ambience = { Intr: BaseIntr; Args: BaseArgs<BaseIntr> };
export type Outcome = { ok: true } | { ok: false; error: any };

export abstract class Executor<M extends Ambience> {
  protected abstract getArgs(): M['Args'] | undefined;
  abstract readonly middleware: MiddlewareClass<M>[];

  constructor(
    readonly intr: M['Intr'],
    readonly cell: Cell,
    readonly command: BaseCommand<M>,
  ) {}

  get client() {
    return this.cell.client;
  }

  async exec() {
    const args = this.getArgs();

    if (!args) {
      return logger.bug.debug(`Failed to gather args for ${this.cell.name}, skipping.`);
    }

    await runMiddleware({
      exec: this,
      args: args,
      do: () =>
        this.command(args)
          .then(() => ({ ok: <const>true }))
          .catch((error) => ({ ok: <const>false, error })),
    });
  }
}
