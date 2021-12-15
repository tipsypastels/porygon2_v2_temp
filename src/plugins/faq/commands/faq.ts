import { Snowflake } from 'discord-api-types';
import { createBuiltinErrors } from 'porygon/error';
import { Command } from 'porygon/interaction';
import { isGuildedKind } from 'porygon/plugin';
import { ellipsis } from 'support/string';
import * as Faq from '../impl/faq_list';

interface Opts {
  question: string;
}

const faq: Command<Opts> = async ({ opts, intr, embed, guild }) => {
  const question = opts.get('question');
  const faq = Faq.getFaq(guild.id, question);

  if (!faq) {
    throw error('unknown', question, guild.id);
  }

  embed.poryColor('info').merge(faq);
  await intr.reply({ embeds: [embed] });
};

faq.data = {
  name: 'faq',
  description: 'Looks up a frequently asked question.',
  options: [
    {
      name: 'question',
      description: "The FAQ entry from Porygon's list.",
      type: 'STRING',
      required: true,
    },
  ],
};

// TODO: better way to type data. should it know the data type of a command
// as a const? maybe overkill
faq.patchBeforeUpload = (data: any, { kind, clone }) => {
  if (isGuildedKind(kind) && Faq.shouldFaqUseChoices(kind.guildId)) {
    const newData = clone(data);

    newData.options[0].choices = Faq.getFaqQuestionsForGuild(kind.guildId).map((x) => ({
      name: x,
      value: x,
    }));

    return newData;
  }
};

export default faq;

const TRUNCATE = 100;
const error = createBuiltinErrors({
  unknown(e, question: string, guildId: Snowflake) {
    const known = Faq.getFaqQuestionsForGuild(guildId)
      .map((x) => `❓ ${x}`)
      .join('\n');

    e.poryErr('warning')
      .setTitle('Unknown Question')
      .setDescription(`I don't have an an entry for \`${ellipsis(question, TRUNCATE)}\`.`)
      .addField('What I do have is these. Do they help?', known);
  },
});
