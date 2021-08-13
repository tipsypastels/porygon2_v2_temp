import { TextChannel } from 'discord.js';
import { DEV } from 'porygon/dev';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { assertOwner } from 'porygon/owner';
import { uptime } from 'porygon/stats';
import * as Assets from 'porygon/assets';
import { previewAssets } from 'porygon/asset/preview';

type SayOpts = { channel: TextChannel; message: string };
type PreviewAssetOpts = { asset: string };

const say: CommandFn<SayOpts> = async ({ opts, intr, embed, author }) => {
  assertOwner(author);

  const { channel, message } = opts.pick('channel', 'message');

  await Promise.all([
    channel.send(message),
    intr.reply({ content: '✅', ephemeral: true }),
  ]);
};

const stats: CommandFn = async ({ embed, intr, client, author }) => {
  assertOwner(author);

  embed
    .poryColor('info')
    .setTitle('Stats for operators')
    .addField('Servers', client.guilds.cache.size.toString())
    .addField('Uptime', uptime.inWords())
    .addField('Heartbeat', `${client.ws.ping}ms`);

  await intr.reply({ embeds: [embed] });
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

const op = commandGroups({ say, stats, previewasset });

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
          name: 'channel',
          description: 'The channel to send to.',
          type: 'CHANNEL',
          required: true,
        },
        {
          name: 'message',
          description: 'The message to send.',
          type: 'STRING',
          required: true,
        },
      ],
    },
    {
      name: 'stats',
      description: 'Shows useful stats.',
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
