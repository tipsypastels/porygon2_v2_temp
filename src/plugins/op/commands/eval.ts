/* eslint-disable @typescript-eslint/no-unused-vars */

import { db as dbImport } from 'porygon//core';
import { Command } from 'porygon/interaction';
import { assertOwner } from 'porygon/owner';
import { codeBlock } from 'support/string';
import { Plugin as PluginImport } from 'porygon/plugin';
import { DEV } from 'porygon/dev';

interface Opts {
  code: string;
  quiet?: boolean;
}

const eval_: Command<Opts> = async (args) => {
  assertOwner(args.author);

  const { intr, author, guild, embed, client, opts, cell } = args;
  const code = opts.get('code');
  const { plugin } = cell;
  const db = dbImport;
  const Plugin = PluginImport;

  const result = eval(code);

  embed
    .poryColor('ok')
    .setTitle('Evaluated Code')
    .addField('Input', js(code, { inspect: false }))
    .addField('Output', js(result, { inspect: true }));

  await intr.reply({ embeds: [embed] });
};

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
  ],
};

export default eval_;

function js(code: string, { inspect }: { inspect: boolean }) {
  return codeBlock(code, { lang: 'js', inspect });
}
