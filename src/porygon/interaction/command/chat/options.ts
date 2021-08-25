import {
  CommandInteractionOption as Option,
  CommandInteractionOptionResolver as Resolver,
} from 'discord.js';
import fromEntries from 'object.fromentries';

export class CommandOptions<Opts> {
  constructor(private res: Resolver) {}

  get<K extends keyof Opts & string>(key: K) {
    return this.getValue(key, true);
  }

  try<K extends keyof Opts & string>(key: K): Opts[K] | undefined {
    return this.getValue(key);
  }

  pick<K extends keyof Opts & string>(...keys: K[]): Pick<Opts, K> {
    const values = keys.map((key) => [key, this.get(key)]);
    return fromEntries(values);
  }

  pickPresent<K extends keyof Opts & string>(...keys: K[]): Pick<Opts, K> {
    const out: Partial<Pick<Opts, K>> = {};

    for (const key of keys) {
      const value = this.try(key);
      if (value != null) out[key] = value;
    }

    return out as Pick<Opts, K>;
  }

  private getValue<K extends keyof Opts & string>(key: K): Opts[K] | undefined;
  private getValue<K extends keyof Opts & string>(key: K, required: true): Opts[K];
  private getValue(key: string, required?: boolean): any {
    const option = this.res.get(key, required);

    if (!option) {
      return;
    }

    switch (option.type) {
      case 'CHANNEL': {
        return option.channel;
      }
      case 'USER': {
        return option.member;
      }
      case 'ROLE': {
        return option.role;
      }
      default: {
        // note, we don't support mentionable via this system
        // nor subcommand/group since those have proper methods
        return option.value;
      }
    }
  }

  getSerializedOptionsString() {
    const items: string[] = [];

    function pushItem(item: string) {
      items.push(item);
    }

    function pushKeyword(keyword: string, value: string) {
      pushItem(`${keyword}: ${value}`);
    }

    if (this.res['_group']) pushItem(this.res['_group']);
    if (this.res['_subcommand']) pushItem(this.res['_subcommand']);

    for (const option of this.res['_hoistedOptions']) {
      pushKeyword(option.name, this.serializeValue(option));
    }

    return items.join(' ');
  }

  private serializeValue(option: Option): string {
    // prettier-ignore
    switch (option.type) {
      case 'CHANNEL': return option.channel!.name;
      case 'ROLE': return option.role!.name;
      case 'USER': return option.user!.username;
      case 'MENTIONABLE': return '<Mentionable>';
      case 'SUB_COMMAND': return option.name;
      case 'SUB_COMMAND_GROUP': return option.name;
      default: return option.value!.toString();
    }
  }

  get subCommand() {
    return this.res.getSubcommand();
  }

  get subCommandGroup() {
    return this.res.getSubcommandGroup();
  }
}
