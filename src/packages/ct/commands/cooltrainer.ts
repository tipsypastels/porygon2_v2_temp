import { GuildMember } from 'discord.js';
import { DEV } from 'porygon/dev';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { ctCreateScoreboard, ctFetchSummary, ctRunCycle, ctRunTick } from '../impl';

type ShowOpts = { member: GuildMember };

const scoreboard: CommandFn = async ({ embed, intr, guild }) => {
  const scoreboard = ctCreateScoreboard(guild);

  for await (const { member, score } of scoreboard) {
    embed.addField(member.displayName, score.toString());
  }

  embed.poryColor('info').setTitle('COOLTRAINER Scoreboard');
  await intr.reply({ embeds: [embed] });
};

const tick: CommandFn = async ({ embed, intr, guild }) => {
  ctRunTick(guild);
  embed.poryColor('ok').setTitle('Initiated a COOLTRAINER tick.');

  await intr.reply({ embeds: [embed], ephemeral: true });
};

const cycle: CommandFn = async ({ embed, intr, guild }) => {
  ctRunCycle(guild);
  embed.poryColor('ok').setTitle('Initiated a COOLTRAINER cycle.');

  await intr.reply({ embeds: [embed], ephemeral: true });
};

const show: CommandFn<ShowOpts> = async ({ opts, intr, embed }) => {
  const member = opts.get('member');
  const summary = await ctFetchSummary(member);

  embed
    .poryColor('info')
    .setTitle(member.displayName)
    .addField('Score', summary.score.toString())
    .addField('Has COOLTRAINER', summary.state);

  await intr.reply({ embeds: [embed] });
};

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
