import { Package } from 'porygon/package';
import { BaseCommand } from './base';
import { ApplicationCommand as Api, BaseCommandInteraction } from 'discord.js';
import { ContextMenu, callContextMenu } from './context_menu/context_menu';
import { Command, callCommand } from './chat';

export class Cell {
  constructor(readonly pkg: Package, private api: Api, private cmd: BaseCommand<any>) {}

  get id() {
    return this.api.id;
  }

  get name() {
    return this.api.name;
  }

  get client() {
    return this.pkg.client;
  }

  call(intr: BaseCommandInteraction): void {
    if (intr.isCommand()) {
      return callCommand(intr, this, this.cmd as Command);
    }

    if (intr.isContextMenu()) {
      return callContextMenu(intr, this, this.cmd as ContextMenu);
    }
  }
}
