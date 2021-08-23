import { ApplicationCommandOptionData, Guild, GuildMember, Role } from 'discord.js';
import { DEV } from 'porygon/dev';
import { Embed } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { Cell, CommandFn, commandGroups } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import { Stringable } from 'support/string';
import { collectPermInfoSummary } from '../impl/perm_info';

type Allow = 'yes' | 'no' | 'clear';

type RoleOpts = { command: string; role: Role; allow: Allow };
type MemberOpts = { command: string; member: GuildMember; allow: Allow };
type ShowOpts = { command: string; verbose?: boolean };

const role: CommandFn<RoleOpts> = async ({ opts, embed, intr, guild }) => {
  const { command, role, allow } = opts.pick('command', 'role', 'allow');
  const cell = getCell(guild, command);

  await setPerm(cell, allow, role);

  embed.mergeWith(result, command, allow, role);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const member: CommandFn<MemberOpts> = async ({ opts, embed, intr, guild }) => {
  const { command, member, allow } = opts.pick('command', 'member', 'allow');
  const cell = getCell(guild, command);

  await setPerm(cell, allow, member);

  embed.mergeWith(result, command, allow, member);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const show: CommandFn<ShowOpts> = async ({ opts, embed, intr, guild }) => {
  const command = opts.get('command');
  const verbose = opts.try('verbose') ?? false;
  const cell = getCell(guild, command);

  const summary = await collectPermInfoSummary({ cell, guild, verbose });

  embed
    .poryColor('info')
    .setTitle(lang('summary.title', { command }))
    .addField(lang('summary.default'), cell.defaultPerm ? 'Yes' : 'No')
    .merge(summary);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

function getCell(guild: Guild, name: string): Cell {
  const cell = Cell.withNameOnGuild(name, guild);
  if (cell) return cell;

  throw error('unkCell', name);
}

function setPerm(cell: Cell, allow: Allow, target: GuildMember | Role) {
  if (allow === 'clear') return cell.clearPerm(target);
  return cell.setPerm(target, allow === 'yes');
}

function result(e: Embed, command: string, allow: Allow, target: Stringable) {
  e.poryColor('ok')
    .setTitle(lang('success.title'))
    .setDescription(resultDesc(command, allow, target));
}

function resultDesc(command: string, allow: Allow, target: Stringable) {
  if (allow === 'clear') {
    return lang('success.cleared', { command, target });
  } else {
    const avail = allow === 'yes' ? 'enabled' : 'disabled';
    return lang('success.desc', { command, avail, target });
  }
}

const perm = commandGroups({ role, member, show });

const CMD: ApplicationCommandOptionData = {
  name: 'command',
  description: 'The name of the command.',
  required: true,
  type: 'STRING',
};

const ALLOW: ApplicationCommandOptionData = {
  name: 'allow',
  description: 'Whether the command should be allowed.',
  required: true,
  type: 'STRING',
  choices: [
    { name: 'Yes', value: 'yes' },
    { name: 'No', value: 'no' },
    { name: 'Clear', value: 'clear' },
  ],
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
      options: [
        CMD,
        {
          name: 'verbose',
          description: 'Whether to show permissions that have no effect.',
          type: 'BOOLEAN',
          required: false,
        },
      ],
    },
  ],
};

export default perm;

const lang = createLang(<const>{
  unkCell: {
    title: 'Unknown command: {command}',
  },
  success: {
    title: 'Success!',
    desc: '{command} is now {avail} for {target}!',
    cleared: '{command} is no longer set for {target}.',
  },
  summary: {
    title: 'Permissions for {command}',
    default: 'Enabled by default',
  },
});

const error = createBuiltinErrors({
  unkCell(e, command: string) {
    e.poryErr('danger').setTitle(lang('unkCell.title', { command }));
  },
});
