import { Guild, GuildMember, Role } from 'discord.js';
import { Embed } from 'porygon/embed';
import { Cell } from 'porygon/interaction';
import { toSentence } from 'support/array';
import { CacheTable } from 'support/cache';
import { capitalize } from 'support/string';

interface Opts {
  cell: Cell;
  guild: Guild;
  /**
   * Whether the list should include users whose permission is *explicitly* the same
   * as the default permission. This would effectively do nothing, but can become
   * relevant if the default permission is later changed.
   */
  verbose: boolean;
}

type Item = { toString(): string };
type KeyType = 'users' | 'roles';
type KeyScope = 'same' | 'different';
type Key = `${KeyType}_${KeyScope}`;
type Push =
  | { type: 'USER'; target: GuildMember; permission: boolean }
  | { type: 'ROLE'; target: Role; permission: boolean };

export async function collectPermInfoSummary({ cell, guild, verbose }: Opts) {
  const perms = await cell.getPerms(guild).catch(() => []);
  const defaultPerm = cell.defaultPerm;
  const collector = new Collector(defaultPerm);

  const promises = perms.map(async ({ type, id, permission }) => {
    if (!verbose && permission === defaultPerm) {
      return;
    }

    const manager = type === 'ROLE' ? guild.roles : guild.members;
    const target = await manager.fetch(id).catch(() => null);

    if (target) {
      collector.push({ type, target, permission } as Push);
    }
  });

  await Promise.all(promises);

  return function (embed: Embed) {
    embed.mergeWith(collector, 'users_different');
    embed.mergeWith(collector, 'roles_different');

    if (verbose) {
      embed.mergeWith(collector, 'users_same');
      embed.mergeWith(collector, 'roles_same');
    }
  };
}

class Collector {
  private table = new CacheTable<Item, Key>();

  constructor(private defaultPerm: boolean) {}

  push(push: Push) {
    this.table.add(this.keyFor(push), push.target);
  }

  intoEmbedWith(embed: Embed, key: Key) {
    const data = this.get(key);
    if (data) embed.addField(data.title, data.value);
  }

  private get(key: Key) {
    const items = this.table.get(key);

    if (items.length > 0) {
      return {
        value: toSentence(items),
        title: this.getTitle(key),
      };
    }
  }

  private keyFor(push: Push): Key {
    const type = push.type === 'USER' ? 'users' : 'roles';
    const scope = push.permission === this.defaultPerm ? 'same' : 'different';
    return `${type}_${scope}`;
  }

  private getTitle(key: Key) {
    const [type, scope] = key.split('_') as [KeyType, KeyScope];
    const isSame = scope === 'same';
    const hasPerm = this.defaultPerm === isSame;
    const explicit = isSame ? 'explicitly ' : '';

    let withType = hasPerm ? 'with' : 'without';
    if (isSame) withType = withType.toUpperCase();

    return `${capitalize(type)} ${explicit}${withType} access`;
  }
}
