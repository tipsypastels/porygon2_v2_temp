import { ApplicationCommandOptionData, Guild, GuildMember, Role } from 'discord.js';
import { DEV } from 'porygon/dev';
import { Embed } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { Cell, CommandFn, commandGroups } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import { isOwner } from 'porygon/owner';
import { Stringable } from 'support/string';
import { collectPermInfoSummary } from '../impl/perm_info';

type Allow = 'yes' | 'no' | 'clear';

type GetOpts = { command: string; verbose?: boolean };
type SetOpts = { command: string; subject: GuildMember | Role; allow: Allow };
type CanUseOpts = { command: string; member: GuildMember };

const get: CommandFn<GetOpts> = async ({ opts, embed, intr, author }) => {
  const { guild } = author;
  const command = opts.get('command');
  const verbose = opts.try('verbose') ?? false;
  const cell = getCell(author.guild, command);

  const summary = await collectPermInfoSummary({ cell, guild, verbose });

  embed
    .poryColor('info')
    .setTitle(lang('summary.title', { command }))
    .addField(lang('summary.default'), cell.defaultPerm ? 'Yes' : 'No')
    .merge(summary);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

const set: CommandFn<SetOpts> = async ({ opts, embed, intr, author }) => {
  const { command, subject, allow } = opts.pick('command', 'subject', 'allow');
  const cell = getCell(author.guild, command);

  await assertCanManagePermissionForCell(cell, author);
  await setPerm(cell, allow, subject);

  embed.mergeWith(result, command, allow, subject);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const canuse: CommandFn<CanUseOpts> = async ({ opts, intr, embed }) => {
  const command = opts.get('command');
  const member = opts.get('member');
  const cell = getCell(member.guild, command);

  const usable = await cell.isUsableBy(member);

  embed
    .poryColor('info')
    .setTitle(lang(`canuse.${usable}`, { command, member: member.displayName }));

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

function result(e: Embed, command: string, allow: Allow, subject: Stringable) {
  e.poryColor('ok')
    .setTitle(lang('success.title'))
    .setDescription(resultDesc(command, allow, subject));
}

function resultDesc(command: string, allow: Allow, subject: Stringable) {
  if (allow === 'clear') {
    return lang('success.cleared', { command, subject });
  } else {
    const avail = allow === 'yes' ? 'enabled' : 'disabled';
    return lang('success.desc', { command, avail, subject });
  }
}

async function assertCanManagePermissionForCell(cell: Cell, author: GuildMember) {
  if (isOwner(author) || (await cell.isUsableBy(author))) {
    return;
  }

  throw error('illegalSet', cell);
}

const perm = commandGroups({ get, set, canuse });

const CMD: ApplicationCommandOptionData = {
  name: 'command',
  description: 'The name of the command.',
  required: true,
  type: 'STRING',
};

perm.unknownErrorEphemerality = () => true;
perm.data = {
  name: 'perm',
  description: 'Manages command permissions.',
  defaultPermission: DEV,
  options: [
    {
      name: 'get',
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
    {
      name: 'set',
      description: 'Manages permissions for a command.',
      type: 'SUB_COMMAND',
      options: [
        CMD,
        {
          name: 'subject',
          description: 'The member or role set permissions for.',
          required: true,
          type: 'MENTIONABLE',
        },
        {
          name: 'allow',
          description: 'Whether the command should be allowed.',
          required: true,
          type: 'STRING',
          choices: [
            { name: 'Yes', value: 'yes' },
            { name: 'No', value: 'no' },
            { name: 'Clear', value: 'clear' },
          ],
        },
      ],
    },

    {
      name: 'canuse',
      description: 'Detect whether a member can use a command.',
      type: 'SUB_COMMAND',
      options: [
        CMD,
        {
          name: 'member',
          description: 'The member to detect.',
          required: true,
          type: 'USER',
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
  illegalSet: {
    title: "You can't manage access to {command}.",
    desc: "You may not manage access to commands that you can't use yourself. If this is something you need help with, talk to Dakota.",
  },
  success: {
    title: 'Success!',
    desc: '{command} is now {avail} for {subject}!',
    cleared: '{command} is no longer set for {subject}.',
  },
  summary: {
    title: 'Permissions for {command}',
    default: 'Enabled by default',
  },
  canuse: {
    true: '{member} can use {command}.',
    false: '{member} cannot use {command}.',
  },
});

const error = createBuiltinErrors({
  unkCell(e, command: string) {
    e.poryErr('danger').setTitle(lang('unkCell.title', { command }));
  },
  illegalSet(e, cell: Cell) {
    e.poryErr('danger').assign(lang('illegalSet', { command: cell.name }));
  },
});
