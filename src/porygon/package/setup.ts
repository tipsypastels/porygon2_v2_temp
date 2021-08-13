import { Porygon } from 'porygon/core';
import { createImporter } from 'porygon/importer';
import { setupLogger } from 'porygon/logger';
import { dirname, basename } from 'path';
import { PackageDev, PackageKind } from './kind';
import { DEV } from 'porygon/dev';
import { stat } from 'fs/promises';
import { Package } from './package';
import { BaseCommand } from 'porygon/interaction';
import { createDynamicDirectoryList } from 'support/dir';
import { EventFactory as Handler, setupEventFactory as setupHandler } from './events';

export async function setupPackages(client: Porygon) {
  await importPackages(client);
  await Package.uploadAllCommands();
  await clearGlobalCommandsInDev(client);
}

const PACKAGE_PATH = `/${__dirname}/../../packages/<eachDir>/$package`;

async function importPackages(client: Porygon) {
  const files = await createDynamicDirectoryList(PACKAGE_PATH);
  const importer = createImporter<PackageKind>(files);

  return await importer(async ({ path, load }) => {
    const dir = dirname(path);

    setupLogger.info(`Setting up package ${basename(dir)}...`);

    const prodKind = await load();
    const kind = DEV ? PackageDev.init() : prodKind;
    const pkg = Package.init(kind, client);

    async function setupCommands() {
      const commandDir = `${dir}/commands`;

      if (await exists(commandDir)) {
        const commandFiles = await createDynamicDirectoryList(`${commandDir}/<eachFile>`);
        const commandImporter = createImporter<BaseCommand>(commandFiles);
        await commandImporter(async ({ load }) => pkg.addCommand(await load()));
      }
    }

    async function setupEvents() {
      const eventDir = `${dir}/events`;

      if (await exists(eventDir)) {
        const eventFiles = await createDynamicDirectoryList(`${eventDir}/<eachFile>`);
        const eventImporter = createImporter<Handler>(eventFiles);
        await eventImporter(async ({ load }) => setupHandler(client, kind, await load()));
      }
    }

    await Promise.all([setupCommands(), setupEvents()]);
  });
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
