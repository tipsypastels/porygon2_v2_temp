import { PackageKind, PackageKindOrDev } from './kind';
import { ClientEvents as Events, Guild } from 'discord.js';
import { Porygon } from 'porygon/core';

type Event = keyof Events;
type Callback<K extends Event> = (...args: Events[K]) => void;
type Occurrence = 'on' | 'once';
export type HandlerEventProxy = ReturnType<typeof proxy>;

function proxy(client: Porygon, kind: PackageKind) {
  function wrap<K extends Event>(occ: Occurrence, key: K, cb: Callback<K>) {
    return client[occ](key, (...args) => {
      const guild = toGuild(args[0]);

      if (kind.matches(guild?.id)) {
        cb(...args);
      }
    });
  }

  function on<K extends Event>(key: K, cb: Callback<K>) {
    return wrap('on', key, cb);
  }

  function once<K extends Event>(key: K, cb: Callback<K>) {
    return wrap('once', key, cb);
  }

  function globalOn<K extends Event>(key: K, cb: Callback<K>) {
    return client.on(key, cb);
  }

  function globalOnce<K extends Event>(key: K, cb: Callback<K>) {
    return client.once(key, cb);
  }

  return { on, once, globalOn, globalOnce };
}

function toGuild(obj: any): Guild | undefined {
  if (obj instanceof Guild) {
    return obj;
  }

  if (obj.guild instanceof Guild) {
    return obj.guild;
  }
}

interface Args<K extends PackageKind> {
  events: HandlerEventProxy;
  kind: PackageKindOrDev<K>;
  client: Porygon;
}

export interface EventFactory<K extends PackageKind = any> {
  (args: Args<K>): void;
}

export function setupEventFactory(
  client: Porygon,
  kind: PackageKind,
  factory: EventFactory<any>,
) {
  factory({ client, kind, events: proxy(client, kind) });
}
