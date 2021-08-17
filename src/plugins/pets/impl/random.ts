import { PkgPets_Pet } from '@prisma/client';
import { Guild, GuildMember } from 'discord.js';
import { db } from 'porygon/core';
import { Embed, fromMember } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { bugLogger } from 'porygon/logger';

export async function petRandom(guild: Guild, member?: GuildMember) {
  const entry = await randomEntry(guild, member);

  if (!entry) {
    throw error('petNone', member);
  }

  const owner = member ?? (await guild.members.fetch(entry.userId).catch(() => null));

  if (!owner) {
    // this is just here to avoid a race condition if a member just left the server
    // and we haven't deactivated their pets yet. it should be extremely rare
    bugLogger.debug(`RACE: Rolled a pet entry for missing member ${entry.userId}.`);
    throw error('petRaceCondDetected');
  }

  return function (embed: Embed) {
    embed
      .poryColor('info')
      .setAuthor(...fromMember(owner))
      .setImage(entry.url)
      .setFooter(lang('remove', { id: entry.id }));
  };
}

async function randomEntry(guild: Guild, member?: GuildMember) {
  const [entry] = await (member ? randomBy(guild, member) : randomBase(guild));
  return entry as PkgPets_Pet | undefined;
}

function randomBase(guild: Guild) {
  return db.$queryRaw<PkgPets_Pet[]>`
    SELECT
      *
    FROM
      "public"."PkgPets_Pet"
    WHERE
      "PkgPets_Pet"."guildId" = ${guild.id}
    AND
      "PkgPets_Pet"."active" = TRUE
    ORDER BY
      RANDOM()
    LIMIT
      1
  `;
}
function randomBy(guild: Guild, member: GuildMember) {
  return db.$queryRaw<PkgPets_Pet[]>`
    SELECT
      *
    FROM
      "public"."PkgPets_Pet"
    WHERE
      "PkgPets_Pet"."guildId" = ${guild.id}
    AND
      "PkgPets_Pet"."active" = TRUE
    AND 
      "PkgPets_Pet"."userId" = ${member.id}
    ORDER BY
      RANDOM()
    LIMIT
      1
  `;
}

const lang = createLang(<const>{
  none: '{ctx} has not uploaded any pets.',
  remove: 'Remove this entry with /pet remove {id}.',
  raceCond: {
    title: 'Pory stumbles around sleepily, bumping into a wall.',
    desc: 'Could you give that one more try? Sorry, my fault.',
  },
});

const error = createBuiltinErrors({
  petNone(e, mem: GuildMember | undefined) {
    const ctx = mem?.displayName ?? 'This server';
    e.poryErr('warning').setTitle(lang('none', { ctx }));
  },
  petRaceCondDetected(e) {
    e.poryColor('warning')
      .poryThumb('plead')
      .setTitle(lang('raceCond.title'))
      .setDescription(lang('raceCond.desc'));
  },
});
