import { Command } from 'porygon/interaction';
import { config } from 'porygon/config';
import { random } from 'support/array';

const LINES = config('plug.duck.inky.lines');

const inky: Command = async ({ embed, intr }) => {
  embed.poryColor('info').poryThumb('plead').setDescription(random(LINES.value));
  await intr.reply({ embeds: [embed] });
};

inky.data = {
  name: 'inky',
  description: '🥺',
};

export default inky;
