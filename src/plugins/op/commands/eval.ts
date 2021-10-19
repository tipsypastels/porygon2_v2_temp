/* eslint-disable @typescript-eslint/no-unused-vars */

import { db as dbImport } from 'porygon/core';
import { Cell as CellImport, Command } from 'porygon/interaction';
import { assertOwner } from 'porygon/owner';
import { codeBlock } from 'support/string';
import { Plugin as PluginImport } from 'porygon/plugin';
import { DEV } from 'porygon/dev';
import { CLEAR_POKECOM_JOIN_CACHE_TASK } from 'plugins/pokecom/events/join_date';
import { sleep } from 'support/async';
import { Seconds } from 'support/time';
import { config } from 'porygon/config';
import { Embed } from 'porygon/embed';
import { logger } from 'porygon/logger';

interface Opts {
  code: string;
  loud?: boolean;
}

const eval_: Command<Opts> = async (args) => {
  assertOwner(args.author);

  const { intr, author, guild, embed, client, opts, cell, channel } = args;
  const code = opts.get('code');
  const ephemeral = !opts.try('loud');
  const { plugin } = cell;
  const db = dbImport;
  const Plugin = PluginImport;
  const Cell = CellImport;

  const result = await eval(code);

  // eval stores some functions which are too unstructured
  // or infrequently used to be worth even an /op command
  // might rethink this once discord hides commands one
  // can't use, but i don't want to flood the list with
  // op stuff right now so i'm hiding smaller things
  // in here.

  // enables /perm, which allows managing permissions
  function enablePermForMe() {
    const perm = Cell.withNameOnGuild('perm', guild);
    return perm?.setPerm(author, true);
  }

  // alters the "Enable Application Commands" for every role on the server
  async function setCommandsEnabled(enabled: boolean) {
    intr.reply({ content: 'Starting...', ephemeral });

    const stats = { success: 0, failure: 0 };

    for await (const [, role] of guild.roles.cache) {
      try {
        const method = enabled ? 'add' : 'remove';
        const perms = role.permissions[method]('USE_APPLICATION_COMMANDS');
        await role.setPermissions(perms);
        console.log(role.name);
        stats.success++;
      } catch (e) {
        console.error(`${role.name}: ${e}`);
        stats.failure++;
      }

      await sleep(Seconds(2));
    }

    return stats;
  }

  async function rebuildPokecomJoinCache() {
    intr.reply({ content: 'Starting...', ephemeral });
    return await CLEAR_POKECOM_JOIN_CACHE_TASK.run(guild);
  }

  async function lag() {
    await sleep(Seconds(5));
    return 'lagging...';
  }

  function testVibePhrases() {
    logger.bug.debug('Running a %vibe grammar test%, console with get busy!');

    const template = <const>[
      ['is', 'negative'],
      ['but makes up for it by being', 'positive'],
    ];

    for (const [prefix, trait] of template) {
      logger.bug.debug(`- Trait: %${trait}% -`);

      const strings = config(`plug.duck.vibe.${trait}Traits`).value;

      for (const string of strings) {
        logger.bug.debug(`${prefix} ${string}`);
      }
    }

    return 'Please check the console for output.';
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
  defaultPermission: DEV,
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
