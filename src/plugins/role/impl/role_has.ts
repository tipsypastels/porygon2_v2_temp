import { GuildMember, Role } from 'discord.js';
import { createBuiltinErrors } from 'porygon/error';
import { createLang } from 'porygon/lang';

export async function assertHasRole(member: GuildMember, role: Role) {
  if (!member.roles.cache.has(role.id)) throw error('lacks', role);
}

export async function assertLacksRole(member: GuildMember, role: Role) {
  if (member.roles.cache.has(role.id)) throw error('has', role);
}

const lang = createLang(<const>{
  has: 'You already have "{role}"!',
  lacks: 'You don\'t have the role "{role}"!',
});

const error = createBuiltinErrors({
  has(e, role: Role) {
    e.poryErr('warning').setTitle(lang('has', { role: role.name }));
  },
  lacks(e, role: Role) {
    e.poryErr('warning').setTitle(lang('lacks', { role: role.name }));
  },
});
