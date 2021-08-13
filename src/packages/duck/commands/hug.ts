import { GuildMember } from 'discord.js';
import { Command } from 'porygon/interaction';
import { random } from 'support/array';

interface Opts {
  member: GuildMember;
}

const STATS = ['Attack', 'Defense', 'Speed', 'Special Attack', 'Special Defense', 'HP'];

const hug: Command<Opts> = async ({ opts, embed, intr, author }) => {
  const subject = opts.get('member');
  const isSelf = author.id === subject.id;
  const subjectLine = isSelf ? 'themself' : subject.displayName;

  const stat = random(STATS);

  embed
    .poryColor('ok')
    .setTitle(`${author.displayName} hugs ${subjectLine}!`)
    .setDescription(`:hugging: ${subject.displayName}'s ${stat} rose!`);

  await intr.reply({ embeds: [embed] });
};

hug.data = {
  name: 'hug',
  description: 'Hugs a friend.',
  options: [
    {
      name: 'member',
      type: 'USER',
      description: 'The member to hug.',
      required: true,
    },
  ],
};

export default hug;
