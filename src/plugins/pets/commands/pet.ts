import { GuildMember } from 'discord.js';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { petAdd, petRandom, petRemove } from '../impl';

type RandOpts = { by?: GuildMember };
type RemOpts = { id: number };

const add: CommandFn = async ({ embed, intr, author, channel }) => {
  const result = await petAdd(author, channel);

  embed.merge(result);
  await intr.reply({ embeds: [embed] });
};

const remove: CommandFn<RemOpts> = async ({ opts, embed, intr, author }) => {
  const id = opts.get('id');
  const result = await petRemove(id, author);

  embed.merge(result);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const random: CommandFn<RandOpts> = async ({ opts, embed, intr, guild }) => {
  const member = opts.try('by') ?? undefined;
  const result = await petRandom(guild, member);

  embed.merge(result);
  await intr.reply({ embeds: [embed] });
};

const pet = commandGroups({ add, remove, random });

pet.data = {
  name: 'pet',
  description: 'Commands relating to pets.',
  options: [
    {
      name: 'random',
      description:
        'Shows a random pet by a user, or by anyone in the server if no user is provided.',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'by',
          type: 'USER',
          description: 'The user whose pets should be shown.',
          required: false,
        },
      ],
    },
    {
      name: 'add',
      description: 'Adds a new pet.',
      type: 'SUB_COMMAND',
    },
    {
      name: 'remove',
      description: "Removes a pet image from Porygon's database.",
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'id',
          type: 'INTEGER',
          description: 'ID of the pet image.',
          required: true,
        },
      ],
    },
  ],
};

export default pet;
