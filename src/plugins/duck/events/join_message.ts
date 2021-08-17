import { GuildMember } from 'discord.js';
import { config } from 'porygon/config';
import { Embed } from 'porygon/embed';
import { bugLogger } from 'porygon/logger';
import { EventFactory } from 'porygon/plugin';

const CHANNEL_ID = config('pkg.duck.joins.channel');
const ROLE_ID = config('pkg.duck.joins.duckRole');

const join: EventFactory = async ({ events }) => {
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
    return bugLogger.error('Failed to find Duck Communism welcome channel.');
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
    return bugLogger.error('Failed to find Duck Communism member role.');
  }

  member.roles.add(role);
}
