import { Porygon } from 'porygon/core';
import { DEV } from 'porygon/dev';
import { BaseCommand } from 'porygon/interaction';
import { bugLogger, setupLogger } from 'porygon/logger';
import { EventFactory as Handler, setupEventFactory as setupHandler } from './events';
import { PluginDev } from './kind';
import { Plugin } from './plugin';

export async function setupPlugins(client: Porygon) {
  await importPlugins(client);
  await Plugin.uploadAllCommands();
  await clearGlobalCommandsInDev(client);
}

// const PLUGIN_PATH = `/${__dirname}/../../plugins/<eachDir>/$plugin`;

async function importPlugins(client: Porygon) {
  const plugins = await import('plugins/$plugins');

  for (const [dir, module] of Object.entries(plugins)) {
    const prodKind = module.default;
    const kind = DEV ? PluginDev.init() : prodKind;
    const plugin = Plugin.init(kind, client);

    plugin.markDirAsIncluded(dir);

    setupLogger.info(`Setting up plugin ${dir}...`);

    for (const [name, item] of Object.entries(module) as [string, unknown][]) {
      if (name === 'default') {
        continue;
      }

      const type = getPluginItemType(name, dir);

      switch (type) {
        case 'COMMAND': {
          plugin.addCommand(item as BaseCommand);
          break;
        }
        case 'EVENT': {
          setupHandler(client, kind, item as Handler);
          break;
        }
      }
    }
  }
}

function clearGlobalCommandsInDev(client: Porygon) {
  if (DEV) {
    return client.application!.commands.set([]);
  }
}

const ITEM_TYPES = new Set(['COMMAND', 'EVENT'] as const);
type ItemType = typeof ITEM_TYPES extends Set<infer R> ? R : never;

function getPluginItemType(name: string, dir: string) {
  const [type, dir2, rest] = name.split('_');

  if (!rest) {
    bugLogger.warn(`Plugin ${dir} item ${name} should be ${type}_${dir}_${dir2}.`);
  }

  if (rest && dir2 !== dir) {
    throw new Error(`Item dir name is incorrect for ${name} in ${dir}.`);
  }

  if (!ITEM_TYPES.has(type as ItemType)) {
    throw new Error(`Unknown plugin item type: ${type}`);
  }

  return type as ItemType;
}
