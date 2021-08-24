import { Role } from 'discord.js';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { RequiredKey } from 'support/object';
import {
  createRoleConfig,
  getRoleConfig,
  RoleConfigOpts,
  updateRoleConfig,
} from '../impl';

type GetOpts = { role: Role };
type SetOpts = { role: Role } & Partial<RoleConfigOpts>;
type CreateOpts = RequiredKey<Partial<RoleConfigOpts>, 'name'>;

const get: CommandFn<GetOpts> = async ({ opts, intr, embed }) => {
  const role = opts.get('role');
  const config = await getRoleConfig(role);

  embed.poryColor('info').setTitle(role.name).merge(config);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const set: CommandFn<SetOpts> = async ({ opts, intr, embed, author }) => {
  const role = opts.get('role');
  const changes = opts.pickPresent('name', 'hoist', 'requestable', 'mentionable');
  const config = await updateRoleConfig(author, role, changes);

  embed.poryColor('ok').setTitle(`${role.name} updated!`).merge(config);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const create: CommandFn<CreateOpts> = async ({ opts, intr, embed, guild }) => {
  const changes = opts.pickPresent('name', 'hoist', 'requestable', 'mentionable');
  const [role, config] = await createRoleConfig(guild, changes);

  embed.poryColor('ok').setTitle(`${role.name} created!`).merge(config);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const rolemod = commandGroups({ get, set, create });

function NAME(required: boolean) {
  return <const>{
    name: 'name',
    type: 'STRING',
    description: 'The name of the role.',
    required,
  };
}

function ROLE(verb: string) {
  return <const>{
    name: 'role',
    type: 'ROLE',
    description: `The role to ${verb}.`,
    required: true,
  };
}

const HOIST = <const>{
  name: 'hoist',
  type: 'BOOLEAN',
  description: 'Whether to hoist the role.',
  required: false,
};

const MENTIONABLE = <const>{
  name: 'mentionable',
  type: 'BOOLEAN',
  description: 'Whether others can mention the role.',
  required: false,
};

const REQUESTABLE = <const>{
  name: 'requestable',
  type: 'BOOLEAN',
  description: 'Whether users can give themselves the role.',
  required: false,
};

rolemod.data = {
  name: 'rolemod',
  description: 'Manages role settings.',
  defaultPermission: false,
  options: [
    {
      name: 'get',
      description: 'Gets settings for a role.',
      type: 'SUB_COMMAND',
      options: [ROLE('show settings for')],
    },
    {
      name: 'set',
      description: 'Updates settings for a role.',
      type: 'SUB_COMMAND',
      options: [ROLE('update'), NAME(false), HOIST, MENTIONABLE, REQUESTABLE],
    },
    {
      name: 'create',
      description: 'Creates a new role with the specified settings.',
      type: 'SUB_COMMAND',
      options: [NAME(true), HOIST, MENTIONABLE, REQUESTABLE],
    },
  ],
};

export default rolemod;
