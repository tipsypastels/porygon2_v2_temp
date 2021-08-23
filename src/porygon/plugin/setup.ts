import { Porygon } from 'porygon/core';
import { createImporter } from 'porygon/importer';
import { bugLogger, setupLogger } from 'porygon/logger';
import { dirname, basename } from 'path';
import { PluginDev, PluginKind } from './kind';
import { DEV } from 'porygon/dev';
import { stat } from 'fs/promises';
import { Plugin } from './plugin';
import { BaseCommand } from 'porygon/interaction';
import { createDynamicDirectoryList } from 'support/dir';
import { EventFactory as Handler, setupEventFactory as setupHandler } from './events';

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

  // const files = await createDynamicDirectoryList(PLUGIN_PATH);
  // const importer = createImporter<PluginKind>(files);

  // return await importer(async ({ path, load }) => {
  //   const dir = dirname(path);
  //   const dirBase = basename(dir);

  //   const prodKind = await load();
  //   const kind = DEV ? PluginDev.init() : prodKind;
  //   const plugin = Plugin.init(kind, client);

  //   setupLogger.info(`Setting up plugin ${dirBase}... (tag: ${kind.tag})`);

  //   plugin.markDirAsIncluded(dirBase);

  //   async function setupCommands() {
  //     const commandDir = `${dir}/commands`;

  //     if (await exists(commandDir)) {
  //       const commandFiles = await createDynamicDirectoryList(`${commandDir}/<eachFile>`);
  //       const commandImporter = createImporter<BaseCommand>(commandFiles);
  //       await commandImporter(async ({ load }) => plugin.addCommand(await load()));
  //     }
  //   }

  //   async function setupEvents() {
  //     const eventDir = `${dir}/events`;

  //     if (await exists(eventDir)) {
  //       const eventFiles = await createDynamicDirectoryList(`${eventDir}/<eachFile>`);
  //       const eventImporter = createImporter<Handler>(eventFiles);
  //       await eventImporter(async ({ load }) => setupHandler(client, kind, await load()));
  //     }
  //   }

  //   await Promise.all([setupCommands(), setupEvents()]);
  // });
}

function clearGlobalCommandsInDev(client: Porygon) {
  if (DEV) {
    return client.application!.commands.set([]);
  }
}

function exists(dir: string) {
  return stat(dir)
    .then(() => true)
    .catch(() => false);
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
