import { Role } from 'discord.js';
import { config } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { createBuiltinErrors } from 'porygon/error';
import { Command } from 'porygon/interaction';
import { random } from 'support/array';

const ROLES = [
  config('plug.pokecom.annivTeamRoles.scarlet'),
  config('plug.pokecom.annivTeamRoles.violet'),
];

const jointeam: Command = async ({ intr, author, guild, embed }) => {
  for (const { value: roleId } of ROLES) {
    const role = author.roles.cache.get(roleId);

    if (role) {
      throw error('alreadyAssigned', role);
    }
  }

  const roleId = random(ROLES).value;
  const role = await guild.roles.fetch(roleId);

  if (!role) {
    throw error('teamRoleNotFoundPub');
  }

  await author.roles.add(role);

  embed.setColor(role.color).setTitle(`You joined team ${role.name}!`);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

jointeam.data = {
  name: 'jointeam',
  defaultPermission: DEV,
  description: 'Joins a random team for the PC Discord Anniversary events.',
};

export default jointeam;

const error = createBuiltinErrors({
  teamRoleNotFoundPub(e) {
    e.poryErr('warning')
      .setTitle("I couldn't find the anniversary team roles!")
      .setDescription('Please tell a moderoid the command is misconfigured.');
  },

  alreadyAssigned(e, role: Role) {
    e.poryErr('danger').setTitle(`You're already on team ${role.name}!`);
  },
});
