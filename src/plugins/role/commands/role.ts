import { Role } from 'discord.js';
import { config } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { isGuildedKind } from 'porygon/plugin';
import { assertHasRole, assertLacksRole, assertRoleRequestable } from '../impl';
import * as Custom from '../impl/role_custom';

type Opts = { role: Role };
type CustomOpts = { color?: string; name?: string };

const add: CommandFn<Opts> = async ({ opts, intr, embed, author }) => {
  const role = opts.get('role');

  await assertLacksRole(author, role);
  await assertRoleRequestable(role);
  await author.roles.add(role);

  embed.poryColor('ok').setTitle(`Gave you "${role.name}"!`);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const remove: CommandFn<Opts> = async ({ opts, intr, embed, author }) => {
  const role = opts.get('role');

  await assertHasRole(author, role);
  await assertRoleRequestable(role);
  await author.roles.remove(role);

  embed.poryColor('ok').setTitle(`Took away "${role.name}"!`);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const custom: CommandFn<CustomOpts> = async ({ opts, intr, embed, author }) => {
  const name = opts.try('name');
  const color = opts.try('color');
  const message = await Custom.applyCustomRole(author, { name, color });

  embed.poryColor('ok').setTitle(message);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const role = commandGroups({ add, remove, custom });

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

// `custom` command is pc-exclusive, but we don't want to
// make it into a totally different subcommand
role.patchBeforeUpload = (data, { kind }) => {
  const isPC = isGuildedKind(kind) && kind.guildId === config('guilds.pokecom.id').value;

  if (DEV || isPC) {
    data.options.push({
      name: 'custom',
      description: 'Sets the colour or name of your custom role.',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'color',
          type: 'STRING',
          description: 'Colour to set the role to.',
          required: false,
        },
        {
          name: 'name',
          type: 'STRING',
          description: 'Name to rename the role to.',
          required: false,
        },
      ],
    });
  }
};

export default role;
