import { Command } from 'porygon/interaction';
import * as Dice from '../dice';

interface Opts {
  dice?: string;
}

const roll: Command<Opts> = async ({ opts, embed, intr }) => {
  const roll = Dice.parseDiceRoll(opts.try('dice') ?? '');
  const notation = Dice.unparseDiceRoll(roll);
  const results = Dice.tallyDiceRoll(roll);

  embed.poryColor('info').setTitle(`Rolling ${notation}`).merge(results);
  await intr.reply({ embeds: [embed] });
};

roll.data = {
  name: 'roll',
  description: 'Rolls the dice!',
  options: [
    {
      name: 'dice',
      type: 'STRING',
      required: false,
      description: 'Dice notation for the roll. Will be 1d6 if omitted.',
    },
  ],
};

export default roll;
