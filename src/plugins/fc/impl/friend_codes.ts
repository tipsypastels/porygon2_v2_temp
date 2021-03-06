import { PlugFc_Codes } from '.prisma/client';
import { GuildMember, Snowflake } from 'discord.js';
import { db } from 'porygon/core';
import { Embed } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { createLang } from 'porygon/lang';
import { isBlank } from 'support/object';
import { codeBlock } from 'support/string';

const TABLE = db.plugFc_Codes;
const SYNTAX = /^\d{4}-\d{4}-\d{4}$/;

export type FcClearCode = keyof Setter | 'all';

interface Setter {
  ds?: string;
  go?: string;
  switch?: string;
}

export async function getFriendCodes(member: GuildMember) {
  const entry = await TABLE.findFirst({ where: { userId: member.id } });
  return createIntoEmbed(member, entry);
}

export async function setFriendCodes(member: GuildMember, set?: Setter) {
  if (isBlank(set)) {
    throw error('noOpSet');
  }

  const data = normalize(set);
  const entry = await TABLE.upsert({
    where: { userId: member.id },
    update: data,
    create: { ...data, userId: member.id },
  });

  return createIntoEmbed(member, entry);
}

export async function clearFriendCode(member: GuildMember, code: FcClearCode) {
  const userId = member.id;
  const cur = await TABLE.findFirst({ where: { userId } });

  if (!cur) {
    throw error('noOpDel');
  }

  if (code === 'all') {
    await delEntry(userId);
    return (e: Embed) => e.assign(lang('clear.all'));
  }

  if (!cur[code]) {
    throw error('noOpClearCode', code);
  }

  if (isEmptyExceptForTarget(cur, code)) {
    await delEntry(userId);
  } else {
    await TABLE.update({ where: { userId }, data: { [code]: null } });
  }

  return (e: Embed) => e.assign(lang('clear.code', { code }));
}

function delEntry(userId: Snowflake) {
  return TABLE.delete({ where: { userId } });
}

function isEmptyExceptForTarget(entry: PlugFc_Codes, code: keyof Setter) {
  const dup: Partial<PlugFc_Codes> = { ...entry };

  delete dup.userId;
  delete dup[code];

  return isBlank(dup);
}

function createIntoEmbed(member: GuildMember, entry: PlugFc_Codes | null) {
  return function (e: Embed, isSelf = false) {
    if (!entry) {
      const key = isSelf ? 'emptyGetSelf' : 'emptyGet';
      return e.setDesc(lang(key, { member }));
    }

    if (entry.switch) e.addField('Switch', codeBlock(entry.switch));
    if (entry.ds) e.addField('3DS', codeBlock(entry.ds));
    if (entry.go) e.addField('Go', codeBlock(entry.go));
  };
}

function normalize(set: Setter) {
  return {
    ds: normalizeCode(set.ds),
    go: normalizeCode(set.go),
    switch: normalizeCode(set.switch),
  };
}

function normalizeCode(code: string | undefined) {
  if (!code) return;

  code = code
    .replace(/ +/g, '-') // replace spaces with dashes
    .replace(/(\d{4})(?=\d)/g, '$1-'); // add dashes between four digits if missing

  if (!code.match(SYNTAX)) {
    throw error('invalid', code);
  }

  return code;
}

const lang = createLang(<const>{
  emptyGet: '{member} has no friend codes set.',
  emptyGetSelf: 'You have no friend codes set.',
  emptySet: {
    title: 'You used /fc set with no parameters.',
    desc: 'Please provide at least one of `3ds`, `switch`, or `go` to set.',
  },
  clear: {
    all: {
      title: 'Friend codes cleared!',
      desc: 'All of your friend codes have been removed from my databases.',
    },
    code: {
      title: 'Friend code cleared!',
      desc: 'The `{code}` friend code has been removed from my databases.',
    },
    noOpDel: {
      title: 'Delete what?',
      desc: "I don't believe you had any friend codes to begin with.",
    },
    noOpCode: {
      title: 'Delete that?',
      desc: "You don't even have a saved friend code for `{code}`.",
    },
  },
  malformed: {
    title: '{code} is not a valid friend code.',
    desc: 'Valid friend codes look like `####-####-####`.',
  },
});

const error = createBuiltinErrors({
  invalid(e, code: string) {
    e.poryErr('warning').assign(lang('malformed', { code }));
  },
  noOpSet(e) {
    e.poryErr('warning').assign(lang('emptySet'));
  },
  noOpDel(e) {
    e.poryErr('warning').assign(lang('clear.noOpDel'));
  },
  noOpClearCode(e, code: string) {
    e.poryErr('warning').assign(lang('clear.noOpCode', { code }));
  },
});
