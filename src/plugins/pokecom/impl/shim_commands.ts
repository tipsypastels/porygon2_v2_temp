import { createLang } from 'porygon/lang';
import { Tag } from 'support/object';

type LegacyCommand = Tag<{
  renamed: { to: string };
  unchanged: {};
  removed: {};
}>;

const LEGACY_COMMANDS: Record<string, LegacyCommand> = {
  // FC
  delfc: { kind: 'renamed', to: 'fc clear' },
  fc: { kind: 'renamed', to: 'fc get' },
  setfc: { kind: 'renamed', to: 'fc set' },

  // PETS (includes aliases)
  addpet: { kind: 'renamed', to: 'pet add' },
  addpets: { kind: 'renamed', to: 'pet add' },
  delpet: { kind: 'renamed', to: 'pet remove' },
  delpets: { kind: 'renamed', to: 'pet remove' },
  pet: { kind: 'renamed', to: 'pet random' },
  pets: { kind: 'renamed', to: 'pet random' },

  // REQUESTABLE ROLES
  addrole: { kind: 'renamed', to: 'role add' },
  removerole: { kind: 'renamed', to: 'role remove' },
  rolelist: { kind: 'unchanged' },

  // UTILITIES
  calc: { kind: 'unchanged' },
  dice: { kind: 'renamed', to: 'roll' },
  roll: { kind: 'unchanged' },
  flip: { kind: 'unchanged' },
  guild: { kind: 'removed' },
  poll: { kind: 'removed' },

  // META
  changelog: { kind: 'removed' },
  commands: { kind: 'removed' },
  help: { kind: 'unchanged' },
  ping: { kind: 'unchanged' },
  version: { kind: 'removed' },
};

export function getLegacyCommandShim(command: string) {
  const shim = LEGACY_COMMANDS[command];

  if (!shim) {
    return;
  }

  const params: any = { command, ...shim };
  return lang(shim.kind, params);
}

const lang = createLang(<const>{
  renamed: '`!{command}` has been renamed and is now usable as `/{to}`.',
  unchanged: '`!{command}` is now usable as `/{command}`.',
  removed: '`!{command}` has been removed.',
});
