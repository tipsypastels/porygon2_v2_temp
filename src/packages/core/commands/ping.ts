import { Command } from 'porygon/interaction';
import { uptime } from 'porygon/stats';

const ping: Command = async ({ intr, embed, client }) => {
  embed
    .poryColor('info')
    .poryThumb('speech')
    .setTitle(':sparkles: Pong! Porygon is online~')
    .setDescription('_beep boop_ How are you today?')
    .addField('Uptime', uptime.inWords())
    .addField('Heartbeat', `${client.ws.ping}ms`);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

ping.data = {
  name: 'ping',
  description: 'Pings Porygon.',
};

export default ping;
