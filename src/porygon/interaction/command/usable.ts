import { ApplicationCommandPermissions, GuildMember } from 'discord.js';
import { Cell } from './cell';

export async function isCellUsableBy(cell: Cell, member: GuildMember) {
  const defaultPerm = cell.defaultPerm;
  const perms = await cell.getPerms(member.guild);

  for (const perm of perms) {
    if (!matches(perm, member) || perm.permission === defaultPerm) {
      continue;
    }

    return !defaultPerm;
  }

  return defaultPerm;
}

function matches(perm: ApplicationCommandPermissions, member: GuildMember) {
  // prettier-ignore
  switch (perm.type) {
    case 'ROLE': return member.roles.cache.has(perm.id);
    case 'USER': return member.id === perm.id;
  }
}
