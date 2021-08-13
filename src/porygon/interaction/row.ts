import { Minutes } from 'support/time';
import {
  ButtonInteraction,
  CommandInteraction,
  MessageActionRow,
  MessageActionRowComponent as Component,
  MessageButton as Button,
  MessageSelectMenu as SelectMenu,
  MessageComponentInteraction,
  SelectMenuInteraction,
} from 'discord.js';

const MAX_LISTEN_TIME = Minutes(15);

type Filter = (i: MessageComponentInteraction) => boolean;
type ListenTarget = NonNullable<CommandInteraction['channel']>;
type ListenOpts = Partial<{
  filter: Filter;
  time: number;
}>;

type Handlers<F> = Map<string, F>;
type Builder<T, F> = (item: T, setHandler: (handler: F) => void) => void;
type Fn<E> = (event: E) => void | Promise<void>;
type Event<T, I> = {
  intr: I;
  component: T;
  detatch(): void;
};

export type ButtonFn = Fn<ButtonEvent>;
export type ButtonEvent = Event<Button, ButtonInteraction>;

export type SelectFn = Fn<SelectEvent>;
export type SelectEvent = Event<SelectMenu, SelectMenuInteraction>;

export class Row extends MessageActionRow {
  private buttonHandlers: Handlers<ButtonFn> = new Map();
  private selectHandlers: Handlers<SelectFn> = new Map();

  addButton(builder: Builder<Button, ButtonFn>) {
    return this.build(Button, builder, this.buttonHandlers);
  }

  addSelect(builder: Builder<SelectMenu, SelectFn>) {
    return this.build(SelectMenu, builder, this.selectHandlers);
  }

  private build<T extends Component, F>(
    klass: new () => T,
    builder: Builder<T, F>,
    handlers: Handlers<F>,
  ) {
    const customId = this.createCustomId();
    const component = new klass();

    component.setCustomId(customId);

    let handler: F | undefined;

    function setHandler(to: F) {
      handler = to;
    }

    builder(component, setHandler);

    if (handler) {
      handlers.set(customId, handler);
    }

    return this.addComponents(component);
  }

  private createCustomId() {
    return `${Math.random()}`;
  }

  listen(target: ListenTarget, opts: ListenOpts = {}) {
    const collector = this.createCollector(target, opts);

    collector.on('collect', async (i) => {
      await this.collect(i);
    });

    return collector;
  }

  private createCollector(target: ListenTarget, opts: ListenOpts) {
    const time = opts.time ?? MAX_LISTEN_TIME;
    const filter: Filter = (i) => {
      let valid = this.hasCustomId(i.customId);
      if (opts.filter) valid &&= opts.filter(i);

      return valid;
    };

    return target.createMessageComponentCollector({ time, filter });
  }

  private collect(intr: MessageComponentInteraction) {
    if (intr.isButton()) {
      return this.collectFrom(intr, this.buttonHandlers);
    } else if (intr.isSelectMenu()) {
      return this.collectFrom(intr, this.selectHandlers);
    }
  }

  private collectFrom<T, I extends MessageComponentInteraction>(
    intr: I,
    handlers: Handlers<Fn<Event<T, I>>>,
  ) {
    const handler = handlers.get(intr.customId);
    const component = this.findByCustomId(intr.customId) as T | undefined;

    if (!component || !handler) {
      return;
    }

    const detatch = this.createDetatchFn(intr.customId, handlers);
    return handler({ intr, component, detatch });
  }

  private hasCustomId(customId: string) {
    return this.buttonHandlers.has(customId) || this.selectHandlers.has(customId);
  }

  private findByCustomId(customId: string) {
    const index = this.findIndexByCustomId(customId);
    if (index !== -1) return this.components[index];
  }

  private findIndexByCustomId(customId: string) {
    return this.components.findIndex((c) => c.customId === customId);
  }

  private createDetatchFn(customId: string, handlers: Handlers<unknown>) {
    return function () {
      handlers.delete(customId);
    };
  }
}
