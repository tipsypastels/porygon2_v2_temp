import { Collection, Guild, GuildMember, Snowflake } from 'discord.js';

type Cb<M> = (item: M, batch: number) => void | Promise<void>;
type BatchCb = Cb<Collection<Snowflake, GuildMember>>;
type MemberCb = Cb<GuildMember>;

// NOTE:
// this could technically be faster, because we can fire off the next request
// BEFORE iterating the results of this one by getting .last() early.
// however that would add complexity and this seems plenty fast so i'm holding
// off for now
export async function eachMemberBatch(guild: Guild, cb: BatchCb) {
  let after: string | undefined;
  let memberCount = 0;
  let batchCount = 0;

  for (;;) {
    const members = await guild.members.list({ limit: 1000, after });

    if (members.size === 0) {
      break;
    }

    batchCount++;

    await cb(members, batchCount);

    after = members.last()!.id;
    memberCount += members.size;
  }

  return { memberCount, batchCount };
}

export function eachMember(guild: Guild, cb: MemberCb) {
  return eachMemberBatch(guild, async (members, batchCount) => {
    const promises = members.map(async (member) => await cb(member, batchCount));
    await Promise.all(promises);
  });
}
