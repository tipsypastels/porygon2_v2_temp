import { Command } from 'porygon/interaction';
import { evaluate } from 'porygon/math';
import { codeBlock } from 'support/string';

interface Opts {
  equation: string;
}

const calc: Command<Opts> = async ({ opts, intr, embed }) => {
  const equation = opts.get('equation');

  embed.addField('Equation', codeBlock(equation));

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

  await intr.reply({ embeds: [embed] });
};

calc.data = {
  name: 'calc',
  description: 'Does your math homework.',
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
