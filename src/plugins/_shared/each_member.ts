import { Guild, GuildMember } from 'discord.js';

type Cb = (member: GuildMember, batch: number) => void | Promise<void>;

export interface EachMemberStats {
  memberCount: number;
  batchCount: number;
}

// NOTE:
// this could technically be faster, because we can fire off the next request
// BEFORE iterating the results of this one by getting .last() early.
// however that would add complexity and this seems plenty fast so i'm holding
// off for now
export async function eachMember(guild: Guild, cb: Cb): Promise<EachMemberStats> {
  let after: string | undefined;
  let memberCount = 0;
  let batchCount = 0;

  for (;;) {
    const members = await guild.members.list({ limit: 1000, after });

    if (members.size === 0) {
      break;
    }

    batchCount++;

    const promises = members.map(async (member) => await cb(member, batchCount));
    await Promise.all(promises);

    after = members.last()!.id;
    memberCount += members.size;
  }

  return { memberCount, batchCount };
}
