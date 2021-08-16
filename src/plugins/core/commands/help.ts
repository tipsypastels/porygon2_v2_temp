import { config } from 'porygon/config';
import { Command } from 'porygon/interaction';
import { findOwner } from 'porygon/owner';

const desc = config('help_desc');

const help: Command = async ({ client, embed, intr }) => {
  const owner = findOwner(client);
  const ownerAvatar = owner?.avatarURL() ?? undefined;

  embed
    .poryColor('info')
    .poryThumb('smile')
    .setTitle("Hello! My name's Pory.")
    .setDescription(desc.value)
    .setFooter('Created by Dakota', ownerAvatar);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

help.data = {
  name: 'help',
  description: 'Shows basic help information',
};

export default help;
