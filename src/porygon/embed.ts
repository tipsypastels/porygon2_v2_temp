import { GuildMember, MessageEmbed, User } from 'discord.js';
import { AssetGroupKey } from './asset';
import { PORY_ASSETS } from './assets';

export type IntoEmbedFn = (embed: Embed) => void;
export type IntoEmbed = IntoEmbedFn | { intoEmbed: IntoEmbedFn };

export class Embed extends MessageEmbed {
  merge(into: IntoEmbed | undefined) {
    if (into) typeof into === 'function' ? into(this) : into.intoEmbed(this);
    return this;
  }

  poryThumb(thumb: AssetGroupKey<typeof PORY_ASSETS>) {
    return this.setThumbnail(PORY_ASSETS.get(thumb).url);
  }

  poryColor(color: keyof typeof COLORS) {
    return this.setColor(COLORS[color]);
  }

  clearImage() {
    this.image = null;
    return this;
  }

  addInlineField(name: string, value: string) {
    return this.addField(name, value, true);
  }
}

const COLORS = {
  ok: 0x7fc13a,
  info: 0x00c17d,
  error: 0xff0041,
  danger: 0xff8931,
  warning: 0xfdbe4a,
};

interface FromOpts {
  url?: string;
  withDisc?: boolean;
}

type From = [string, string | undefined, string | undefined];

export function fromUser(user: GuildMember | User, opts: FromOpts = {}): From {
  if (user instanceof GuildMember) {
    return fromUser(user.user, opts);
  }

  const { username } = user;
  const name = opts.withDisc ? `${username}#${user.discriminator}` : username;
  return [name, user.avatarURL() ?? undefined, opts.url];
}

export function fromMember(member: GuildMember, opts: FromOpts = {}): From {
  const { displayName: dn } = member;
  const name = opts.withDisc ? `${dn}#${member.user.discriminator}` : dn;
  return [name, member.user.avatarURL() ?? undefined, opts.url];
}
