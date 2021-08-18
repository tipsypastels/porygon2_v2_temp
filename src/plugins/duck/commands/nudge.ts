import { Guild } from 'discord.js';
import { Command } from 'porygon/interaction';
import { config } from 'porygon/config';
import { random, toSentence } from 'support/array';
import { InclusiveRange } from 'support/range';

const BASE_COUNT = new InclusiveRange(3, 7);
const DISASTERS = config('plug.duck.nudge.disasters');

const nudge: Command = async ({ guild, embed, intr }) => {
  embed.poryColor('ok').setTitle(disaster()).setDescription(deaths(guild));
  await intr.reply({ embeds: [embed] });
};

nudge.data = {
  name: 'nudge',
  description: 'Never use this it literally causes natural disasters.',
};

export default nudge;

function disaster() {
  return random(DISASTERS.value);
}

function deaths(guild: Guild) {
  const count = Math.min(BASE_COUNT.random(), guild.memberCount);
  const members = guild.members.cache.random(count);

  return `${toSentence(members)} were killed.`;
}
