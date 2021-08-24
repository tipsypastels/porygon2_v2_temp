import { TextChannel } from 'discord.js';
import { DEV } from 'porygon/dev';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { assertOwner } from 'porygon/owner';
import { missedPartialLeaves, uptime } from 'porygon/stats';
import * as Assets from 'porygon/assets';
import { Plugin } from 'porygon/plugin';
import { previewAssets } from 'porygon/asset/preview';

type SayOpts = { message: string; channel?: TextChannel };
type PreviewAssetOpts = { asset: string };

const say: CommandFn<SayOpts> = async ({ opts, intr, channel, author }) => {
  assertOwner(author);

  const message = opts.get('message');
  const destination = opts.try('channel') ?? channel;

  await intr.reply({ content: '\\✅', ephemeral: true });
  await destination.send(message);
};

const stats: CommandFn = async ({ embed, intr, client, author }) => {
  assertOwner(author);

  embed
    .poryColor('info')
    .setTitle('Stats for operators')
    .addField('Servers', client.guilds.cache.size.toString())
    .addField('Uptime', uptime.inWords())
    .addField('Heartbeat', `${client.ws.ping}ms`)
    .addField('Missed Leaves', missedPartialLeaves.toString());

  await intr.reply({ embeds: [embed], ephemeral: true });
};

const pluginfo: CommandFn = async ({ embed, intr, author }) => {
  assertOwner(author);

  for (const [, plugin] of Plugin.ALL) {
    embed.merge((e) => plugin.intoPlugInfoEmbed(e));
  }

  embed.setTitle('Plugin Status');
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const previewasset: CommandFn<PreviewAssetOpts> = async ({
  opts,
  intr,
  channel,
  author,
}) => {
  assertOwner(author);

  const name = opts.get('asset');
  const asset = fetchAsset(name);

  await intr.reply({ content: '✅ Beginning preview', ephemeral: true });
  await previewAssets(asset, channel);
  await intr.followUp({ content: '✅ Completed preview', ephemeral: true });
};

const op = commandGroups({ say, stats, pluginfo, previewasset });

op.data = {
  name: 'op',
  defaultPermission: DEV,
  description: 'Operator-only utilities.',
  options: [
    {
      name: 'say',
      description: 'Send a message to any channel.',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'message',
          description: 'The message to send.',
          type: 'STRING',
          required: true,
        },
        {
          name: 'channel',
          description: 'The channel to send to. Defaults to current if unset.',
          type: 'CHANNEL',
          required: false,
        },
      ],
    },
    {
      name: 'stats',
      description: 'Shows useful stats.',
      type: 'SUB_COMMAND',
    },
    {
      name: 'pluginfo',
      description: 'Shows the status of plugins.',
      type: 'SUB_COMMAND',
    },
    {
      name: 'previewasset',
      description: 'Previews an asset or asset group.',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'asset',
          description: 'Exported name of asset to preview.',
          type: 'STRING',
          required: true,
          choices: Object.keys(Assets).map((key) => ({ name: key, value: key })),
        },
      ],
    },
  ],
};

export default op;

function fetchAsset(name: string) {
  if (!(name in Assets)) {
    throw new Error(`Unknown asset: ${name}.`);
  }

  return Assets[name as keyof typeof Assets];
}
