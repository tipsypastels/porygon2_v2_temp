import { Command } from 'porygon/interaction';
import { evaluate } from 'porygon/math';
import { codeBlock, ellipsis } from 'support/string';

interface Opts {
  equation: string;
}

const TRUNCATE = 100;

const calc: Command<Opts> = async ({ opts, intr, embed }) => {
  const equation = opts.get('equation');

  const formattedEquation = codeBlock(ellipsis(equation, TRUNCATE));
  embed.addField('Equation', formattedEquation);

  try {
    const result = await evaluate(equation);

    embed
      .poryColor('info')
      .setTitle('Aaaand the answer is...')
      .addField('Result', codeBlock(result));
  } catch (error) {
    embed
      .poryColor('warning')
      .addField('Error', codeBlock(error.message))
      .setTitle('_Porygon adjusts her glasses and takes another look at that equation._');
  }

  await intr.reply({ embeds: [embed], ephemeral: true });
};

calc.data = {
  name: 'calc',
  description: 'Doe.s your math homework.',
  options: [
    {
      name: 'equation',
      type: 'STRING',
      required: true,
      description: 'An equation to evaluate.',
    },
  ],
};

export default calc;
