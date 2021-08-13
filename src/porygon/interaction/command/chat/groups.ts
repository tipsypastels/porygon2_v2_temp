import { Command, CommandFn } from './command';

type Groups<Opts> = {
  [K in keyof Opts]: CommandFn<Opts[K]>;
};

// HACK: casting these to command is actually incorrect, since they're missing
// the data. However, this is for the convenience of not having to cast them
// explicitly at every call site just to add the data properties. I could pass
// the data in here, but that would make it a completely different syntax to
// declare the data of grouped commands. In practice, a command missing its
// data will fail startup, so this is unlikely to be a problem. Just a tad
// ugly.
export function commandGroups<Opts>(fns: Groups<Opts>): Command<Opts> {
  return function (args) {
    const subCommand = args.opts.subCommand;

    if (!subCommand) {
      throw new Error('commandGroups was used but no subcommand was found.');
    }

    if (!(subCommand in fns)) {
      throw new Error(`Unknown subcommand: ${subCommand}`);
    }

    const fn = fns[subCommand as keyof Opts];
    return fn(args as any);
  } as Command;
}
