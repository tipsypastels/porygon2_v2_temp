import { GuildMember } from 'discord.js';
import { CommandFn, commandGroups } from 'porygon/interaction';
import {
  clearFriendCode,
  FcClearCode,
  getFriendCodes,
  setFriendCodes,
} from '../impl/friend_codes';

type GetOpts = { member?: GuildMember };
type SetOpts = { 'switch'?: string; '3ds'?: string; 'go'?: string };
type ClearOpts = { code: FcClearCode };

const get: CommandFn<GetOpts> = async ({ embed, opts, intr, author }) => {
  const member = opts.try('member') ?? author;
  const isSelf = member.id === author.id;
  const result = await getFriendCodes(member);

  embed
    .poryColor('info')
    .setTitle('Friend Codes')
    .setAuthor(member)
    .mergeWith(result, isSelf);

  await intr.reply({ embeds: [embed] });
};

const set: CommandFn<SetOpts> = async ({ embed, opts, intr, author }) => {
  const result = await setFriendCodes(author, {
    switch: opts.try('switch'),
    ds: opts.try('3ds'),
    go: opts.try('go'),
  });

  embed.poryColor('ok').setTitle('Friend Codes updated!').merge(result);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const clear: CommandFn<ClearOpts> = async ({ embed, opts, intr, author }) => {
  const code = opts.get('code');
  const result = await clearFriendCode(author, code);

  embed.poryColor('ok').merge(result);
  await intr.reply({ embeds: [embed], ephemeral: true });
};

const fc = commandGroups({ get, set, clear });

fc.data = {
  name: 'fc',
  description: 'Friend-code related utilities.',
  options: [
    {
      name: 'get',
      type: 'SUB_COMMAND',
      description: "Get a member's friend codes.",
      options: [
        {
          name: 'member',
          type: 'USER',
          description: 'Member to get. Defaults to you if unset.',
          required: false,
        },
      ],
    },
    {
      name: 'set',
      type: 'SUB_COMMAND',
      description: 'Set one or more of your friend codes.',
      options: [
        {
          name: 'switch',
          type: 'STRING',
          required: false,
          description: 'Your Nintendo Switch friend code.',
        },
        {
          name: '3ds',
          type: 'STRING',
          required: false,
          description: 'Your 3DS friend code.',
        },

        {
          name: 'go',
          type: 'STRING',
          required: false,
          description: 'Your Pokémon Go friend code.',
        },
      ],
    },
    {
      name: 'clear',
      type: 'SUB_COMMAND',
      description: 'Clear one or all of your friend codes from the database.',
      options: [
        {
          name: 'code',
          type: 'STRING',
          required: true,
          description: 'The code to clear.',
          choices: [
            { name: 'Switch', value: 'switch' },
            { name: '3DS', value: 'ds' },
            { name: 'Go', value: 'go' },
            { name: 'All', value: 'all' },
          ],
        },
      ],
    },
  ],
};

export default fc;
