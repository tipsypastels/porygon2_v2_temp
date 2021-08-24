import { Role } from 'discord.js';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { assertHasRole, assertLacksRole, assertRoleRequestable } from '../impl';

type Opts = { role: Role };

const add: CommandFn<Opts> = async ({ opts, intr, embed, author, cell }) => {
  const role = opts.get('role');

  await assertLacksRole(author, role);
  await assertRoleRequestable(role, cell.plugin);
  await author.roles.add(role);

  embed.poryColor('ok').setTitle(`Gave you "${role.name}"!`);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const remove: CommandFn<Opts> = async ({ opts, intr, embed, author, cell }) => {
  const role = opts.get('role');

  await assertHasRole(author, role);
  await assertRoleRequestable(role, cell.plugin);
  await author.roles.remove(role);

  embed.poryColor('ok').setTitle(`Took away "${role.name}"!`);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const role = commandGroups({ add, remove });

function ROLE(verb: string) {
  return <const>{
    name: 'role',
    type: 'ROLE',
    description: `The role to ${verb}.`,
    required: true,
  };
}

role.data = {
  name: 'role',
  description: 'Commands relating to roles.',
  options: [
    {
      name: 'add',
      description: 'Adds a role.',
      type: 'SUB_COMMAND',
      options: [ROLE('add')],
    },
    {
      name: 'remove',
      description: 'Removes a role.',
      type: 'SUB_COMMAND',
      options: [ROLE('remove')],
    },
  ],
};

export default role;
