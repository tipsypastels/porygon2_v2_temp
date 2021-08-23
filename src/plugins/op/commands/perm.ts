import { Guild, GuildMember, Role } from 'discord.js';
import { DEV } from 'porygon/dev';
import { Embed } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { Cell, CommandFn, commandGroups } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import { toSentence } from 'support/array';
import { Stringable } from 'support/string';

type RoleOpts = { cmd: string; role: Role; allow: boolean };
type MemberOpts = { cmd: string; member: GuildMember; allow: boolean };
type ShowOpts = { cmd: string };

const role: CommandFn<RoleOpts> = async ({ opts, embed, intr, guild }) => {
  const { cmd, role, allow } = opts.pick('cmd', 'role', 'allow');
  await getCell(guild, cmd).setPerm(role, allow);

  embed.mergeWith(result, cmd, allow, role);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const member: CommandFn<MemberOpts> = async ({ opts, embed, intr, guild }) => {
  const { cmd, member, allow } = opts.pick('cmd', 'member', 'allow');
  await getCell(guild, cmd).setPerm(member, allow);

  embed.mergeWith(result, cmd, allow, member);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const show: CommandFn<ShowOpts> = async ({ opts, embed, intr, guild }) => {
  const cmd = opts.get('cmd');
  const cell = getCell(guild, cmd);
  const defaultPerm = cell.defaultPerm;
  const summary = await cell.getPermSummary(guild);

  const matchedMembers: GuildMember[] = [];
  const matchedRoles: Role[] = [];

  for (const entry of summary) {
    // don't show members who's permission is manually set to the same as the default
    // this might become an option later. verbose mode maybe?
    if (entry.permission !== defaultPerm) {
      if (entry.type === 'ROLE') matchedRoles.push(entry.target);
      else matchedMembers.push(entry.target);
    }
  }

  embed
    .poryColor('info')
    .setTitle(lang('summary.title', { cmd }))
    .addField(lang('summary.default'), defaultPerm ? 'Yes' : 'No')
    .mergeWith(summaryGroup, matchedMembers, 'members', defaultPerm)
    .mergeWith(summaryGroup, matchedRoles, 'roles', defaultPerm);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

function getCell(guild: Guild, name: string): Cell {
  const cell = Cell.withNameOnGuild(name, guild);
  if (cell) return cell;

  throw error('unkCell', name);
}

function result(e: Embed, cmd: string, perm: boolean, target: Stringable) {
  const avail = perm ? 'enabled' : 'disabled';

  e.poryColor('ok')
    .setTitle(lang('success.title'))
    .setDescription(lang('success.desc', { cmd, avail, target }));
}

type Domain = 'members' | 'roles';

function summaryGroup<T>(e: Embed, items: T[], domain: Domain, def: boolean) {
  if (items.length === 0) {
    return;
  }

  const phrase = <const>`summary.${domain}With${def ? 'out' : ''}`;
  const title = lang(phrase, { count: items.length });
  const body = toSentence(items);

  e.addField(title, body);
}

const perm = commandGroups({ role, member, show });

const CMD = <const>{
  name: 'cmd',
  description: 'The name of the command.',
  required: true,
  type: 'STRING',
};

const ALLOW = <const>{
  name: 'allow',
  description: 'Whether the command should be allowed.',
  required: true,
  type: 'BOOLEAN',
};

perm.unknownErrorEphemerality = () => true;
perm.data = {
  name: 'perm',
  description: 'Manages command permissions.',
  defaultPermission: DEV,
  options: [
    {
      name: 'role',
      description: 'Manages permissions for a role.',
      type: 'SUB_COMMAND',
      options: [
        CMD,
        {
          name: 'role',
          description: 'The role set permissions for.',
          required: true,
          type: 'ROLE',
        },
        ALLOW,
      ],
    },
    {
      name: 'member',
      description: 'Manages permissions for a member.',
      type: 'SUB_COMMAND',
      options: [
        CMD,
        {
          name: 'member',
          description: 'The member to set permissions for.',
          required: true,
          type: 'USER',
        },
        ALLOW,
      ],
    },
    {
      name: 'show',
      description: 'Shows who has permissions to use a command.',
      type: 'SUB_COMMAND',
      options: [CMD],
    },
  ],
};

export default perm;

const lang = createLang(<const>{
  unkCell: {
    title: 'Unknown command: {cmd}',
  },
  success: {
    title: 'Success!',
    desc: '{cmd} is now {avail} for {target}!',
  },
  summary: {
    title: 'Permissions for {cmd}',
    default: 'Enabled by default',
    rolesWith: {
      1: 'Role with access',
      _: 'Roles with access',
    },
    rolesWithout: {
      1: 'Role without access',
      _: 'Roles without access',
    },
    membersWith: {
      1: 'Member with access',
      _: 'Members with access',
    },
    membersWithout: {
      1: 'Member without access',
      _: 'Members without access',
    },
  },
});

const error = createBuiltinErrors({
  unkCell(e, cmd: string) {
    e.poryErr('danger').setTitle(lang('unkCell.title', { cmd }));
  },
});
