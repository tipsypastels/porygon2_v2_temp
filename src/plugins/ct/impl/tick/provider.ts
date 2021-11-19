import { GuildMember, Role, Snowflake } from 'discord.js';
import { db } from 'porygon/core';

const TABLE = db.plugCt_Score;
const toUsername = (m: GuildMember) => m.user.username;

export function ctCreateTickProvider({ mock }: { mock: boolean }) {
  // see ./process.ts note on ToProvider for why this is an inner function
  return function (): CtTickProviderLike {
    return mock ? new CtTickMockProvider() : new CtTickProvider();
  };
}

export abstract class CtTickProviderLike {
  added: GuildMember[] = [];
  removed: GuildMember[] = [];
  trashed = 0;

  protected abstract addImpl(member: GuildMember, role: Role): Promise<GuildMember>;
  protected abstract removeImpl(member: GuildMember, role: Role): Promise<GuildMember>;
  protected abstract trashImpl(userIds: Snowflake[]): Promise<void>;

  add(member: GuildMember, role: Role) {
    this.added.push(member);
    return this.addImpl(member, role);
  }

  remove(member: GuildMember, role: Role) {
    this.removed.push(member);
    return this.removeImpl(member, role);
  }

  trash(userIds: Snowflake[]) {
    this.trashed += userIds.length;
    return this.trashImpl(userIds);
  }

  toJSON() {
    const added = this.added.map(toUsername);
    const removed = this.removed.map(toUsername);
    const trashed = this.trashed;

    return JSON.stringify({ added, removed, trashed }, null, 2);
  }
}

export class CtTickProvider extends CtTickProviderLike {
  protected addImpl(member: GuildMember, role: Role) {
    return member.roles.add(role);
  }

  protected removeImpl(member: GuildMember, role: Role) {
    return member.roles.remove(role);
  }

  protected async trashImpl(userIds: Snowflake[]) {
    await trash(userIds);
  }
}

export class CtTickMockProvider extends CtTickProviderLike {
  protected async addImpl(member: GuildMember) {
    return member;
  }

  protected async removeImpl(member: GuildMember) {
    return member;
  }

  protected async trashImpl() {
    // nothing to see here
  }
}

async function trash(userIds: Snowflake[]) {
  if (userIds.length) {
    await TABLE.deleteMany({ where: { userId: { in: userIds } } });
  }
}
