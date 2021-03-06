import { GuildMember } from 'discord.js';
import { config } from 'porygon/config';
import { Embed } from 'porygon/embed';
import { logger } from 'porygon/logger';
import { EventFactory } from 'porygon/plugin';

type Kind = typeof import('../$plugin').default;

const CHANNEL_ID = config('plug.duck.joins.channel');
const ROLE_ID = config('plug.duck.joins.duckRole');

const join: EventFactory<Kind> = async ({ events }) => {
  events.on('guildMemberAdd', call);
};

export default join;

function call(member: GuildMember) {
  welcome(member);
  addRole(member);
}

async function welcome(member: GuildMember) {
  const { guild } = member;
  const channel = await guild.channels.fetch(CHANNEL_ID.value);

  if (!channel || !channel.isText()) {
    return logger.bug.error('Failed to find Duck Communism welcome channel.');
  }

  const embed = new Embed()
    .poryColor('ok')
    .poryThumb('smile')
    .setDescription(`Welcome to the duck zone, ${member.toString()}`);

  channel.send({ embeds: [embed] });
}

async function addRole(member: GuildMember) {
  const { guild } = member;
  const role = await guild.roles.fetch(ROLE_ID.value);

  if (!role) {
    return logger.bug.error('Failed to find Duck Communism member role.');
  }

  member.roles.add(role);
}
