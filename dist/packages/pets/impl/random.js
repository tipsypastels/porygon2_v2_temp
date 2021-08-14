"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petRandom = void 0;
const core_1 = require("porygon/core");
const embed_1 = require("porygon/embed");
const error_1 = require("porygon/error");
const lang_1 = require("porygon/lang");
const logger_1 = require("porygon/logger");
async function petRandom(guild, member) {
    const entry = await randomEntry(guild, member);
    if (!entry) {
        throw error_1.embeddedError.warn((e) => e.setTitle(lang('none', { ctx: member?.displayName ?? 'This server' })));
    }
    const owner = member ?? (await guild.members.fetch(entry.userId).catch(() => null));
    if (!owner) {
        // this is just here to avoid a race condition if a member just left the server
        // and we haven't deactivated their pets yet. it should be extremely rare
        logger_1.bugLogger.debug(`RACE: Rolled a pet entry for missing member ${entry.userId}.`);
        throw error_1.embeddedError.warn((e) => {
            e.poryThumb('plead')
                .setTitle(lang('racecond.title'))
                .setDescription(lang('racecond.desc'));
        });
    }
    return function (embed) {
        embed
            .poryColor('info')
            .setAuthor(...embed_1.fromMember(owner))
            .setImage(entry.url)
            .setFooter(lang('remove', { id: entry.id }));
    };
}
exports.petRandom = petRandom;
async function randomEntry(guild, member) {
    const [entry] = await (member ? randomBy(guild, member) : randomBase(guild));
    return entry;
}
function randomBase(guild) {
    return core_1.db.$queryRaw `
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
function randomBy(guild, member) {
    return core_1.db.$queryRaw `
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
const lang = lang_1.createLang({
    none: '{ctx} has not uploaded any pets.',
    remove: 'Remove this entry with /pet remove {id}.',
    racecond: {
        title: 'Pory stumbles around sleepily, bumping into a wall.',
        desc: 'Could you give that one more try? Sorry, my fault.',
    },
});
