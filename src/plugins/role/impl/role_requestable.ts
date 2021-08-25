import { PlugRole_RoleConfig } from '@prisma/client';
import { Guild, Role } from 'discord.js';
import { config } from 'porygon/config';
import { db } from 'porygon/core';
import { createBuiltinErrors } from 'porygon/error';
import { Cell } from 'porygon/interaction';
import { createLang } from 'porygon/lang';

const TABLE = db.plugRole_RoleConfig;
const STAFF_ROLE_NAMES = config('plug.role.staffRoles');

export async function isRoleRequestable({ id: roleId }: Role) {
  const config = await TABLE.findFirst({ where: { roleId } });
  return isRoleConfigRequestable(config);
}

export function isRoleConfigRequestable(config: PlugRole_RoleConfig | null) {
  return config?.requestable ?? false;
}

export async function assertRoleRequestable(role: Role) {
  const is = await isRoleRequestable(role);
  is || respondToStaffRoleRequest(role) || respondToNonRequestableRole(role);
}

function respondToStaffRoleRequest(role: Role) {
  const regex = new RegExp(`^${STAFF_ROLE_NAMES.value.join('|')}$`, 'i');

  if (role.name.match(regex)) {
    throw error('staffRole', role);
  }
}

function respondToNonRequestableRole(role: Role) {
  throw error('notRequestable', role);
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
  notRequestable(e, role: Role) {
    const desc = hasRoleList(role.guild) ? 'descWithRoleList' : 'desc';

    e.poryErr('warning')
      .setTitle(lang('notRequestable.title', { role: role.name }))
      .setDesc(lang(`notRequestable.${desc}`));
  },
});

function hasRoleList(guild: Guild) {
  return Cell.withNameOnGuild('rolelist', guild);
}
