import { CommandInteractionOptionResolver as Resolver } from 'discord.js';
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

  get subCommand() {
    return this.res.getSubcommand();
  }

  get subCommandGroup() {
    return this.res.getSubcommandGroup();
  }
}
