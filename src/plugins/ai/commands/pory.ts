import { Command } from 'porygon/interaction';
import { codeBlock, ellipsis } from 'support/string';
import { Markov } from '../markov';

interface Opts {
  prompt?: string;
}

const TRUNCATE = 300;
const PORY = new Markov({
  name: 'pory',
  fallback: 'hi im pory',
});

const pory: Command<Opts> = async ({ opts, intr, embed, author, client, guild }) => {
  const prompt = opts.try('prompt');
  const response = PORY.speak();
  const bot = guild.members.cache.get(client.user!.id)!;

  if (prompt) {
    const formattedPrompt = codeBlock(ellipsis(prompt, TRUNCATE));
    embed.addField(author.displayName, formattedPrompt);
  }

  embed
    .addField(bot.displayName, codeBlock(response))
    .poryColor('ok')
    .poryThumb('speech');

  await intr.reply({ embeds: [embed] });

  // slow, run after reply
  if (prompt) {
    PORY.learn(prompt);
  }
};

pory.data = {
  name: 'pory',
  description:
    'Speaks to Porygon. Providing an optional message will allow it to be mixed in to future sentences.',
  options: [
    {
      name: 'prompt',
      type: 'STRING',
      required: false,
      description: 'The message to feed to Pory for future sentences.',
    },
  ],
};

export default pory;
