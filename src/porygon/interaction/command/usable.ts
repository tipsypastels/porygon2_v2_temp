import { ApplicationCommandPermissions, GuildMember } from 'discord.js';
import { Cell } from './cell';

export async function isCellUsableBy(cell: Cell, member: GuildMember) {
  const defaultPerm = cell.defaultPerm;
  const perms = await cell.getPerms(member.guild).catch(() => []);

  for (const perm of perms) {
    // if this permission is relevant and not the default, (access to a
    // restricted command or lack of access to a public command) we
    // return that.
    if (!matches(perm, member) || perm.permission === defaultPerm) {
      continue;
    }

    return perm.permission;
  }

  // otherwise just do what the default says
  return defaultPerm;
}

function matches(perm: ApplicationCommandPermissions, member: GuildMember) {
  // prettier-ignore
  switch (perm.type) {
    case 'ROLE': return member.roles.cache.has(perm.id);
    case 'USER': return member.id === perm.id;
  }
}
