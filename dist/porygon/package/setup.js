"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPackages = void 0;
const importer_1 = require("porygon/importer");
const logger_1 = require("porygon/logger");
const path_1 = require("path");
const kind_1 = require("./kind");
const dev_1 = require("porygon/dev");
const promises_1 = require("fs/promises");
const package_1 = require("./package");
const dir_1 = require("support/dir");
const events_1 = require("./events");
async function setupPackages(client) {
    await importPackages(client);
    await package_1.Package.uploadAllCommands();
    await clearGlobalCommandsInDev(client);
}
exports.setupPackages = setupPackages;
const PACKAGE_PATH = `/${__dirname}/../../packages/<eachDir>/$package`;
async function importPackages(client) {
    const files = await dir_1.createDynamicDirectoryList(PACKAGE_PATH);
    const importer = importer_1.createImporter(files);
    return await importer(async ({ path, load }) => {
        const dir = path_1.dirname(path);
        logger_1.setupLogger.info(`Setting up package ${path_1.basename(dir)}...`);
        const prodKind = await load();
        const kind = dev_1.DEV ? kind_1.PackageDev.init() : prodKind;
        const pkg = package_1.Package.init(kind, client);
        async function setupCommands() {
            const commandDir = `${dir}/commands`;
            if (await exists(commandDir)) {
                const commandFiles = await dir_1.createDynamicDirectoryList(`${commandDir}/<eachFile>`);
                const commandImporter = importer_1.createImporter(commandFiles);
                await commandImporter(async ({ load }) => pkg.addCommand(await load()));
            }
        }
        async function setupEvents() {
            const eventDir = `${dir}/events`;
            if (await exists(eventDir)) {
                const eventFiles = await dir_1.createDynamicDirectoryList(`${eventDir}/<eachFile>`);
                const eventImporter = importer_1.createImporter(eventFiles);
                await eventImporter(async ({ load }) => events_1.setupEventFactory(client, kind, await load()));
            }
        }
        await Promise.all([setupCommands(), setupEvents()]);
    });
}
function clearGlobalCommandsInDev(client) {
    if (dev_1.DEV) {
        return client.application.commands.set([]);
    }
}
function exists(dir) {
    return promises_1.stat(dir)
        .then(() => true)
        .catch(() => false);
}
