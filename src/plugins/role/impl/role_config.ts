import { PlugRole_RoleConfig } from '@prisma/client';
import { Guild, GuildMember, Role } from 'discord.js';
import { db } from 'porygon/core';
import { IntoEmbedFn } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { Diff } from 'support/diff';
import { isRoleConfigRequestable } from './role_requestable';

const TABLE = db.plugRole_RoleConfig;

export interface RoleConfigOpts {
  name: string;
  hoist: boolean;
  mentionable: boolean;
  requestable: boolean;
}

export async function getRoleConfig(role: Role) {
  const config = await get(role);
  const presenter = staticPresenter(role, config);
  return present(presenter);
}

export async function createRoleConfig(guild: Guild, opts: Partial<RoleConfigOpts>) {
  const { name, hoist, mentionable, requestable } = opts;
  const role = await guild.roles.create({ name, hoist, mentionable });
  const config = await TABLE.create({ data: { roleId: role.id, requestable } });

  const presenter = staticPresenter(role, config);
  return [role, present(presenter)] as const;
}

export async function updateRoleConfig(
  member: GuildMember,
  role: Role,
  opts: Partial<RoleConfigOpts>,
) {
  const { name, hoist, mentionable, requestable } = opts;
  const config = await get(role);

  const diff = new Diff<RoleConfigOpts>({
    name: role.name,
    hoist: role.hoist,
    mentionable: role.mentionable,
    requestable: isRoleConfigRequestable(config),
  });

  const change = diff.apply(opts);

  if (change === 'empty') throw error('updateEmpty');
  if (change === 'same') throw error('updateSame');
  if (requestable) assertLegalUseOfRequestable(member, role);

  await Promise.all([
    role.edit({ name, hoist, mentionable }),
    TABLE.upsert({
      where: { roleId: role.id },
      update: { requestable },
      create: { requestable, roleId: role.id },
    }),
  ]);

  const presenter = diffPresenter(diff);
  return present(presenter);
}

function get({ id: roleId }: Role) {
  return TABLE.findFirst({ where: { roleId } });
}

type Presenter = (key: keyof RoleConfigOpts) => string;

function present(presenter: Presenter): IntoEmbedFn {
  const keys = ['name', 'hoist', 'requestable', 'mentionable'] as const;
  const fields = keys.map((k) => [lang(k), presenter(k)]);

  return function (embed) {
    fields.forEach(([k, v]) => embed.addField(k, v));
  };
}

function staticPresenter(role: Role, config: PlugRole_RoleConfig | null): Presenter {
  return function (key) {
    if (key === 'requestable') return toString(isRoleConfigRequestable(config));
    return toString(role[key]);
  };
}

function diffPresenter(diff: Diff<RoleConfigOpts>): Presenter {
  return function (key) {
    const state = diff.getState(key);

    if (state.changed) {
      const value = toString(state.value);
      const prevValue = toString(state.prevValue);
      return lang('was', { value, prevValue });
    }

    return toString(state.value);
  };
}

function toString(value: string | boolean): string {
  if (typeof value === 'boolean') return value === true ? 'Yes' : 'No';
  return value;
}

function assertLegalUseOfRequestable(member: GuildMember, role: Role) {
  if (member.roles.highest.position <= role.position) {
    throw error('illegalRequestable');
  }
}

const lang = createLang(<const>{
  name: 'Name',
  hoist: 'Hoisted',
  requestable: 'Requestable',
  mentionable: 'Mentionable',
  was: '{value} (was: {prevValue})',
  update: {
    same: {
      title: 'All the values you provided were the same as the existing values.',
      desc: 'Are you trying to confuse me?',
    },
    empty: {
      title: 'You used /rolemod set with no parameters.',
      desc: 'Nothing to set!',
    },
  },
  illegalRequestable: {
    title: "You can't make this role requestable.",
    desc: 'Roles at or higher than your highest role may not be made requestable.',
  },
});

const error = createBuiltinErrors({
  updateSame(e) {
    e.poryErr('warning').assign(lang('update.same'));
  },
  updateEmpty(e) {
    e.poryErr('warning').assign(lang('update.empty'));
  },
  illegalRequestable(e) {
    e.poryColor('danger').poryThumb('angry').assign(lang('illegalRequestable'));
  },
});
