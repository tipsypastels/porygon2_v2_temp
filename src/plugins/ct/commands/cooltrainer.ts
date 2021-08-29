import { GuildMember } from 'discord.js';
import { DEV } from 'porygon/dev';
import { Embed } from 'porygon/embed';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import { CT_CYCLE_TASK, CT_TICK_TASK } from '../events/ct_schedule';
import * as Ct from '../impl';

type ShowOpts = { member: GuildMember };

const scoreboard: CommandFn = async ({ embed, intr, guild }) => {
  const scoreboard = Ct.ctCreateScoreboard(guild);

  for await (const { member, score } of scoreboard) {
    embed.addField(member.displayName, score.toString());
  }

  embed.poryColor('info').assign(lang('scoreboard')).merge(ctDisabledStatus);
  await intr.reply({ embeds: [embed] });
};

const tick: CommandFn = async ({ embed, intr, guild }) => {
  await intr.deferReply({ ephemeral: true });

  const { result } = await CT_TICK_TASK.run(guild);

  embed
    .poryColor(lang(`task.${result}.color`) as 'ok')
    .setTitle(lang(`task.${result}.title`, { task: 'tick' }));

  await intr.editReply({ embeds: [embed] });
};

const cycle: CommandFn = async ({ embed, intr }) => {
  await intr.deferReply({ ephemeral: true });

  const { result } = await CT_CYCLE_TASK.run();

  embed
    .poryColor(lang(`task.${result}.color`) as 'ok')
    .setTitle(lang(`task.${result}.title`, { task: 'cycle' }));

  await intr.editReply({ embeds: [embed] });
};

const show: CommandFn<ShowOpts> = async ({ opts, intr, embed }) => {
  const member = opts.get('member');
  const summary = await Ct.ctFetchSummary(member);

  embed
    .poryColor('info')
    .setTitle(member.displayName)
    .addField(lang('show.score'), summary.score.toString())
    .addField(lang('show.has'), summary.state)
    .merge(ctDisabledStatus);

  await intr.reply({ embeds: [embed] });
};

function ctDisabledStatus(embed: Embed) {
  if (!Ct.CtConfig.enabled) {
    embed.addField(lang('disabled.name'), lang('disabled.desc'));
  }
}

const cooltrainer = commandGroups({ show, scoreboard, tick, cycle });

cooltrainer.data = {
  name: 'cooltrainer',
  description: 'Commands relating to COOLTRAINER.',
  defaultPermission: DEV,
  options: [
    {
      name: 'scoreboard',
      type: 'SUB_COMMAND',
      description: 'Shows the top COOLTRAINER scores.',
    },
    {
      name: 'show',
      type: 'SUB_COMMAND',
      description: 'Shows the COOLTRAINER information for a user.',
      options: [
        {
          name: 'member',
          type: 'USER',
          description: 'User to show COOLTRAINER information for.',
          required: true,
        },
      ],
    },
    {
      name: 'tick',
      type: 'SUB_COMMAND',
      description:
        "[UNSAFE] Manually runs a COOLTRAINER tick, recalculating everyone's roles accordingly.",
    },
    {
      name: 'cycle',
      type: 'SUB_COMMAND',
      description:
        '[UNSAFE] Manually runs a COOLTRAINER weekly cycle, clearing out points from the previous week.',
    },
  ],
};

export default cooltrainer;

const lang = createLang(<const>{
  task: {
    success: {
      color: 'ok',
      title: 'COOLTRAINER {task} complete!',
    },
    failure: {
      color: 'error',
      title: 'COOLTRAINER {task} failed.',
    },
    skipped: {
      color: 'warning',
      title: 'Task skipped; COOLTRAINER is disabled on this server.',
    },
  },
  disabled: {
    name: '⚠️ Warning',
    desc: 'COOLTRAINER automated tasks (message collection, adjusting roles) are disabled. Set `plug.ct.enabled` to re-enable.',
  },
  scoreboard: {
    title: 'COOLTRAINER Scoreboard',
  },
  show: {
    score: 'Score',
    has: 'Has COOLTRAINER',
  },
});
