import { IntoEmbed } from 'porygon/embed';
import { Command } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import seedRandom from 'seedrandom';
import { random } from 'support/array';

// prettier-ignore
const RESULTS: IntoEmbed[] = [
  (e) => e.poryColor('ok').assign(lang('spare')),
  (e) => e.poryColor('danger').assign(lang('kill')),
];

const thanos: Command = async ({ embed, intr, author }) => {
  const rng = seedRandom(author.id);
  const result = random(RESULTS, rng);

  embed.poryThumb('thanos').merge(result);

  await intr.reply({ embeds: [embed] });
};

thanos.data = {
  name: 'thanos',
  description: 'Rolls the dice on your fate.',
};

export default thanos;

const lang = createLang(<const>{
  spare: {
    title: 'You were spared by Thanos.',
    desc: 'The universe is now perfectly balanced, as all things should be.',
  },
  kill: {
    title: "Miss Pory... I don't feel so good, you say...",
    desc: 'You were slain by Thanos, for the good of the Universe.',
  },
});
