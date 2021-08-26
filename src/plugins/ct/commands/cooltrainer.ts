import { GuildMember } from 'discord.js';
import { DEV } from 'porygon/dev';
import { Embed } from 'porygon/embed';
import { CommandFn, commandGroups } from 'porygon/interaction';
import * as Ct from '../impl';

type ShowOpts = { member: GuildMember };

const scoreboard: CommandFn = async ({ embed, intr, guild }) => {
  const scoreboard = Ct.ctCreateScoreboard(guild);

  for await (const { member, score } of scoreboard) {
    embed.addField(member.displayName, score.toString());
  }

  embed.poryColor('info').setTitle('COOLTRAINER Scoreboard').merge(ctDisabledStatus);
  await intr.reply({ embeds: [embed] });
};

const tick: CommandFn = async ({ embed, intr, guild }) => {
  Ct.ctRunTick(guild);

  embed.poryColor('ok').setTitle('Initiated a COOLTRAINER tick.').merge(ctDisabledStatus);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

const cycle: CommandFn = async ({ embed, intr }) => {
  Ct.ctRunCycle();

  embed
    .poryColor('ok')
    .setTitle('Initiated a COOLTRAINER cycle.')
    .merge(ctDisabledStatus);

  await intr.reply({ embeds: [embed], ephemeral: true });
};

const show: CommandFn<ShowOpts> = async ({ opts, intr, embed }) => {
  const member = opts.get('member');
  const summary = await Ct.ctFetchSummary(member);

  embed
    .poryColor('info')
    .setTitle(member.displayName)
    .addField('Score', summary.score.toString())
    .addField('Has COOLTRAINER', summary.state)
    .merge(ctDisabledStatus);

  await intr.reply({ embeds: [embed] });
};

function ctDisabledStatus(embed: Embed) {
  if (!Ct.CtConfig.enabled) {
    embed.addField(
      '⚠️ Warning',
      'Cooltrainer automated tasks (message collection, adjusting roles) are disabled. Set `plug.ct.enabled` to re-enable.',
    );
  }
}

const cooltrainer = commandGroups({ show, scoreboard, tick, cycle });

cooltrainer.data = {
  name: 'cooltrainer',
  description: 'Commands relating to cooltrainer.',
  defaultPermission: DEV,
  options: [
    {
      name: 'scoreboard',
      type: 'SUB_COMMAND',
      description: 'Shows the top cooltrainer scores.',
    },
    {
      name: 'show',
      type: 'SUB_COMMAND',
      description: 'Shows the cooltrainer information for a user.',
      options: [
        {
          name: 'member',
          type: 'USER',
          description: 'User to show cooltrainer information for.',
          required: true,
        },
      ],
    },
    {
      name: 'tick',
      type: 'SUB_COMMAND',
      description:
        "[UNSAFE] Manually runs a cooltrainer tick, recalculating everyone's roles accordingly.",
    },
    {
      name: 'cycle',
      type: 'SUB_COMMAND',
      description:
        '[UNSAFE] Manually runs a cooltrainer weekly cycle, clearing out points from the previous week.',
    },
  ],
};

export default cooltrainer;
