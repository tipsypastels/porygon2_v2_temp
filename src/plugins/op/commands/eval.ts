/* eslint-disable @typescript-eslint/no-unused-vars */

import { db as dbImport } from 'porygon/core';
import { Cell as CellImport, Command } from 'porygon/interaction';
import { assertOwner } from 'porygon/owner';
import { codeBlock } from 'support/string';
import { Plugin as PluginImport } from 'porygon/plugin';
import { DEV } from 'porygon/dev';

interface Opts {
  code: string;
  loud?: boolean;
}

const eval_: Command<Opts> = async (args) => {
  assertOwner(args.author);

  const { intr, author, guild, embed, client, opts, cell } = args;
  const code = opts.get('code');
  const ephemeral = !opts.try('loud');
  const { plugin } = cell;
  const db = dbImport;
  const Plugin = PluginImport;
  const Cell = CellImport;

  const result = await eval(code);

  // enables /perm, which allows managing permissions
  function enablePermForMe() {
    const perm = Cell.withNameOnGuild('perm', guild);
    return perm?.setPerm(author, true);
  }

  // alters the "Enable Application Commands" for every role on the server
  async function setCommandsEnabled(enabled: boolean) {
    intr.reply('Starting...');

    const stats = { success: 0, failure: 0 };

    for (const [, role] of guild.roles.cache) {
      try {
        const method = enabled ? 'add' : 'remove';
        const perms = role.permissions[method]('USE_APPLICATION_COMMANDS');
        await role.setPermissions(perms);
        await new Promise((r) => setTimeout(r, 5000));
        console.log(role.name);
        stats.success++;
      } catch (e) {
        console.error(`${role.name}: ${e}`);
        stats.failure++;
      }
    }

    return stats;
  }

  embed
    .poryColor('ok')
    .setTitle('Evaluated Code')
    .addField('Input', js(code, { inspect: false }))
    .addField('Output', js(result, { inspect: true }));

  const method = intr.replied ? 'followUp' : 'reply';
  await intr[method]({ embeds: [embed], ephemeral });
};

eval_.unknownErrorEphemerality = ({ opts }) => !opts.try('loud');
eval_.data = {
  name: 'eval',
  defaultPermission: true,
  description: "If you don't know what this does, you shouldn't be using it.",
  options: [
    {
      name: 'code',
      type: 'STRING',
      required: true,
      description: 'Code to be run.',
    },
    {
      name: 'loud',
      type: 'BOOLEAN',
      required: false,
      description: 'Whether the response should be non-ephemeral. ',
    },
  ],
};

export default eval_;

function js(code: string, { inspect }: { inspect: boolean }) {
  return codeBlock(code, { lang: 'js', inspect });
}
