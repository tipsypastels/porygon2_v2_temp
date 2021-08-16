import { GuildMember } from 'discord.js';
import { Command, CommandFn, commandGroups } from 'porygon/interaction';
import { getPatGif, incrementPatCount, patLeaderboard } from '../pats';

type MemberOpts = { member: GuildMember };

const member: CommandFn<MemberOpts> = async ({ opts, embed, intr, author }) => {
  const member = opts.get('member');

  if (member.id !== author.id) {
    incrementPatCount(member);
    embed.setFooter('+1 headpat score!');
  }

  embed
    .poryColor('ok')
    .setDescription(`${member} has been headpat!`)
    .setImage(getPatGif());

  await intr.reply({ embeds: [embed] });
};

const leaderboard: CommandFn = async ({ embed, intr, guild }) => {
  for await (const { member, pats } of patLeaderboard(guild)) {
    embed.addField(member.displayName, `${pats}`);
  }

  embed.poryColor('info').setTitle('Headpats Received');
  await intr.reply({ embeds: [embed] });
};

const pat = commandGroups({ member, leaderboard });

pat.data = {
  name: 'pat',
  description: '*headpats*',
  options: [
    {
      name: 'member',
      type: 'SUB_COMMAND',
      description: 'Headpats a member.',
      options: [
        {
          name: 'member',
          type: 'USER',
          description: 'Member to pat.',
          required: true,
        },
      ],
    },
    {
      name: 'leaderboard',
      type: 'SUB_COMMAND',
      description: 'Shows the most headpatted members.',
    },
  ],
};

export default pat;
