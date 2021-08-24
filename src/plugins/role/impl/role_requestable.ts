import { PlugRole_RoleConfig } from '@prisma/client';
import { Role } from 'discord.js';
import { config } from 'porygon/config';
import { db } from 'porygon/core';
import { createBuiltinErrors } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { Plugin } from 'porygon/plugin';

const TABLE = db.plugRole_RoleConfig;
const STAFF_ROLE_NAMES = config('plug.role.staffRoles');

export async function isRoleRequestable({ id: roleId }: Role) {
  const config = await TABLE.findFirst({ where: { roleId } });
  return isRoleConfigRequestable(config);
}

export function isRoleConfigRequestable(config: PlugRole_RoleConfig | null) {
  return config?.requestable ?? false;
}

export async function assertRoleRequestable(role: Role, plugin: Plugin) {
  const is = await isRoleRequestable(role);
  is || respondToStaffRoleRequest(role) || respondToNonRequestableRole(role, plugin);
}

function respondToStaffRoleRequest(role: Role) {
  const regex = new RegExp(`^${STAFF_ROLE_NAMES.value.join('|')}$`, 'i');

  if (role.name.match(regex)) {
    throw error('staffRole', role);
  }
}

function respondToNonRequestableRole(role: Role, plugin: Plugin) {
  throw error('notRequestable', role, plugin);
}

const lang = createLang(<const>{
  staffRole: {
    title: 'Nice try!',
    desc: 'Requesting {role}? Never seen that one before.',
  },
  notRequestable: {
    title: '"{role}" is not requestable!',
    desc: 'Sorry about that!',
    descWithRoleList: 'You can see a list of requestable roles by using `/rolelist`.',
  },
});

const error = createBuiltinErrors({
  staffRole(e, role: Role) {
    e.poryColor('danger')
      .poryThumb('angry')
      .assign(lang('staffRole', { role: role.name }));
  },
  notRequestable(e, role: Role, plugin: Plugin) {
    const desc = plugin.hasCommand('rolelist') ? 'desc' : 'descWithRoleList';

    e.poryErr('warning')
      .setTitle(lang('notRequestable.title', { role: role.name }))
      .setDesc(lang(`notRequestable.${desc}`));
  },
});
