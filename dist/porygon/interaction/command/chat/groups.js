"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandGroups = void 0;
// HACK: casting these to command is actually incorrect, since they're missing
// the data. However, this is for the convenience of not having to cast them
// explicitly at every call site just to add the data properties. I could pass
// the data in here, but that would make it a completely different syntax to
// declare the data of grouped commands. In practice, a command missing its
// data will fail startup, so this is unlikely to be a problem. Just a tad
// ugly.
function commandGroups(fns) {
    return function (args) {
        const subCommand = args.opts.subCommand;
        if (!subCommand) {
            throw new Error('commandGroups was used but no subcommand was found.');
        }
        if (!(subCommand in fns)) {
            throw new Error(`Unknown subcommand: ${subCommand}`);
        }
        const fn = fns[subCommand];
        return fn(args);
    };
}
exports.commandGroups = commandGroups;
