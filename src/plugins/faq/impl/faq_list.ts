import { Snowflake } from 'discord-api-types';
import { config } from 'porygon/config';
import { IntoEmbed } from 'porygon/embed';
import { GuildConfigName } from 'porygon/guilds';
import { ErsatzTable } from 'support/table';

const MAX_COUNT_TO_USE_DISCORD_CHOICES = 25;
const FAQ = new ErsatzTable<Snowflake, string, IntoEmbed>();

export function addFaq(name: GuildConfigName, question: string, render: IntoEmbed) {
  const { id } = config(`guilds.${name}`).value;
  FAQ.set(id, question, render);
}

export function getFaq(id: Snowflake, question: string) {
  return FAQ.get(id, question);
}

export function shouldFaqUseChoices(id: Snowflake) {
  return FAQ.innerKeys(id).length <= MAX_COUNT_TO_USE_DISCORD_CHOICES;
}

export function getFaqQuestionsForGuild(id: Snowflake) {
  return FAQ.innerKeys(id);
}

export function getGuildNamesWithFaqEntries() {
  const ids = new Set(...FAQ.outerKeys());
  const guilds = config('guilds').value;
  const out: GuildConfigName[] = [];

  for (const [name, { id }] of Object.entries(guilds)) {
    if (ids.has(id)) {
      out.push(name as GuildConfigName);
    }
  }

  return out;
}
