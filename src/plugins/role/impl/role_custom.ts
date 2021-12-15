// unlike the rest of this plugin, this module is pc-specific

import { Guild, GuildMember, Role } from 'discord.js';
import { config } from 'porygon/config';
import { createBuiltinErrors } from 'porygon/error';
import { parseColor } from 'support/color';

const cfg = {
  PC: config('guilds.pokecom.id'),
  CUSTOM_RANGE_START: config('plug.role.custom.roleRange.start'),
  CUSTOM_RANGE_END: config('plug.role.custom.roleRange.end'),
  CAN_CREATE_IN_RANGE: config('plug.role.custom.canCreateCustomRole'),
};

type Change = { name?: string; color?: string };
type Range = { start: number; end: number }; // where start > end
let range: Range | null = null;

export async function applyCustomRole(member: GuildMember, change: Change) {
  if (!change.name && !change.color) {
    throw error('emptyCustomChange');
  }

  const { guild } = member;
  const role = await findCustomRoleInRange(member);
  const color = resolveColorChange(change);

  if (!role) {
    if (memberCanCreateNewCustomRole(member)) {
      const name = change.name ?? member.displayName;
      const range = await getCustomRange(member.guild);
      const role = await guild.roles.create({ name, color, position: range.start - 1 });

      await member.roles.add(role);

      return 'Your custom role has been created!';
    } else {
      throw error('noCustomRoleAndCantCreate');
    }
  }

  await role.edit({ name: change.name, color });
  return 'Your custom role has been updated!';
}

function resolveColorChange(change: Change) {
  if (change.color) {
    try {
      return parseColor(change.color);
    } catch {
      throw error('invalidCustomColor', change.color);
    }
  }
}

function memberCanCreateNewCustomRole(member: GuildMember) {
  return member.roles.cache.has(cfg.CAN_CREATE_IN_RANGE.value);
}

async function findCustomRoleInRange(member: GuildMember) {
  for (const [, role] of member.roles.cache) {
    if (await isInCustomRange(role)) {
      return role;
    }
  }
}

async function isInCustomRange(role: Role) {
  const range = await getCustomRange(role.guild);
  const { position } = role;

  return range.start > position && range.end < position;
}

async function getCustomRange(guild: Guild): Promise<Range> {
  if (!range) {
    const [startRole, endRole] = await Promise.all([
      getRangeBound(guild, cfg.CUSTOM_RANGE_START.value),
      getRangeBound(guild, cfg.CUSTOM_RANGE_END.value),
    ]);

    const start = startRole.position;
    const end = endRole.position;

    if (start <= end) {
      throw error('invalidCustomRoleRange');
    }

    range = { start, end };
  }

  return range;
}

async function getRangeBound(guild: Guild, id: string) {
  const get = (id: string) => guild.roles.fetch(id);
  const role = await get(id).catch(() => null);

  if (!role) {
    throw error('invalidCustomRoleRange');
  }

  return role;
}

const error = createBuiltinErrors({
  emptyCustomChange(e) {
    e.poryColor('warning')
      .poryThumb('plead')
      .setTitle('And... sorry, what were you asking for?')
      .setDesc(
        "You used `/role custom` but didn't specify any changes. You want a custom colour? To rename your role? I can't just guess here.",
      );
  },
  invalidCustomRoleRange(e) {
    e.poryColor('danger')
      .poryThumb('plead')
      .setTitle('Hmm, custom roles seem to be set up wrong.')
      .setDesc('Please report this issue to a staff member so we can get it fixed :)');
  },
  invalidCustomColor(e, input: string) {
    e.poryErr('warning')
      .setTitle("That's not a colour I can work with, sorry!")
      .setDesc(
        "What I'm looking for is a **hex code**. They look like `#ff0000` or `#14aa70` - a hash sign followed by six characters.",
      )
      .addField('You entered', `\`${input}\``);
  },
  noCustomRoleAndCantCreate(e) {
    e.poryErr('warning')
      .setTitle("Sorry! I can't do that.")
      .setDesc(
        "You don't have a personal role for me to use. Personal roles are given to server boosters.",
      );
  },
});
