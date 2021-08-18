import { config } from 'porygon/config';
import { Command } from 'porygon/interaction';
import { random } from 'support/array';
import { ellipsis } from 'support/string';

interface Opts {
  question: string;
}

const LINES = config('plug.duck.8ball.lines');
const TRUNCATE = 300;

const _8ball: Command<Opts> = async ({ opts, embed, intr }) => {
  const question = ellipsis(opts.get('question'), TRUNCATE);
  const line = random(LINES.value);

  embed
    .poryColor('info')
    .poryThumb('8ball')
    .setTitle('The wise oracle Porygon studies her magic 8-ball.')
    .addField('Question', question)
    .addField('Answer', line);

  await intr.reply({ embeds: [embed] });
};

_8ball.data = {
  name: '8ball',
  description: 'Asks a question of the wise oracle Porygon.',
  options: [
    {
      name: 'question',
      type: 'STRING',
      required: true,
      description: 'The question you would ask the wise oracle Porygon.',
    },
  ],
};

export default _8ball;
