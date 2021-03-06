import { config } from 'porygon/config';
import { Command } from 'porygon/interaction';
import { random } from 'support/array';
import { bold } from 'support/string';

const POSITIVE_TRAITS = config('plug.duck.vibe.positiveTraits');
const NEGATIVE_TRAITS = config('plug.duck.vibe.negativeTraits');

type TraitList = typeof POSITIVE_TRAITS;

const vibe: Command = async ({ embed, intr, author }) => {
  const { displayName: name } = author;
  const pos = trait(POSITIVE_TRAITS);
  const neg = trait(NEGATIVE_TRAITS);

  embed
    .poryColor('info')
    .poryThumb('vibe')
    .setAuthor('β¨ ππΎπ·π πΈπ½ππΈπ β¨')
    .setTitle(`${name}'s vibe`)
    .setDescription(`${name} is ${neg} but makes up for it by ${pos}.`);

  await intr.reply({ embeds: [embed] });
};

vibe.data = {
  name: 'vibe',
  description: 'Scientifically analyzes your vibes.',
};

export default vibe;

function trait(list: TraitList) {
  return bold(random(list.value));
}
