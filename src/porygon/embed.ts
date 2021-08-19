import { GuildMember, MessageEmbed, User } from 'discord.js';
import { string } from 'mathjs';
import { AssetGroupKey } from './asset';
import { PORY_ASSETS } from './assets';

export type IntoEmbedFn = (embed: Embed) => void;
export type IntoEmbed = IntoEmbedFn | { intoEmbed: IntoEmbedFn };

export type IntoEmbedFnWith<C extends any[]> = (embed: Embed, ...args: C) => void;
export type IntoEmbedWith<C extends any[]> =
  | IntoEmbedFnWith<C>
  | { intoEmbedWith: IntoEmbedFnWith<C> };

const COLORS = {
  ok: 0x7fc13a,
  info: 0x00c17d,
  error: 0xff0041,
  danger: 0xff8931,
  warning: 0xfdbe4a,
};

interface AuthorUserOpts {
  withDisc?: boolean;
  url?: string;
}

type EmbedDataSpecialCases = {
  desc: string;
};

type EmbedData = EmbedDataSpecialCases &
  {
    [K in keyof Embed as Embed[K] extends object ? never : K]: Embed[K];
  };

export class Embed extends MessageEmbed {
  merge(into: IntoEmbed | undefined) {
    if (into) typeof into === 'function' ? into(this) : into.intoEmbed(this);
    return this;
  }

  mergeWith<C extends any[]>(into: IntoEmbedWith<C> | undefined, ...args: C) {
    if (into)
      typeof into === 'function'
        ? into(this, ...args)
        : into.intoEmbedWith(this, ...args);
    return this;
  }

  mergeProps(props: Partial<EmbedData>) {
    props.description = props.desc;
    delete props.desc;

    Object.assign(this, props);
    return this;
  }

  poryThumb(thumb: AssetGroupKey<typeof PORY_ASSETS>) {
    return this.setThumbnail(PORY_ASSETS.get(thumb).url);
  }

  poryColor(color: keyof typeof COLORS) {
    return this.setColor(COLORS[color]);
  }

  poryErr(state: AssetGroupKey<typeof PORY_ASSETS> & keyof typeof COLORS) {
    return this.poryThumb(state).poryColor(state);
  }

  clearImage() {
    this.image = null;
    return this;
  }

  addInlineField(name: string, value: string) {
    return this.addField(name, value, true);
  }

  setDesc(desc: string) {
    return this.setDescription(desc);
  }

  // this was previously smarter but discriminated unions don't seem to work
  // for tuples. in other news i'm about to fucking snap :)
  override setAuthor(user: User, opts?: AuthorUserOpts): this;
  override setAuthor(member: GuildMember, opts?: AuthorUserOpts): this;
  override setAuthor(name: string, icon?: string, url?: string): this;
  override setAuthor(...args: any) {
    if (typeof args[0] === 'string') {
      return super.setAuthor(args[0], args[1], args[2]);
    }

    if (args[0] instanceof GuildMember) {
      return this.mergeWith(memberIntoEmbed, args[0], args[1]);
    }

    return this.mergeWith(userIntoEmbed, args[0], args[1]);
  }
}

function memberIntoEmbed(e: Embed, mem: GuildMember, opts?: AuthorUserOpts) {
  const { displayName: dn, user } = mem;
  const name = opts?.withDisc ? `${dn}${user.discriminator}` : dn;
  e.setAuthor(name, user.avatarURL() ?? undefined, opts?.url);
}

function userIntoEmbed(e: Embed, user: User, opts?: AuthorUserOpts) {
  const { username: un, discriminator: disc } = user;
  const name = opts?.withDisc ? `${un}#${disc}` : un;
  e.setAuthor(name, user.avatarURL() ?? undefined, opts?.url);
}
