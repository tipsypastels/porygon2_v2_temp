"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUploadChannel = exports.setupAssets = exports.assetSetupIsDone = void 0;
const promises_1 = require("fs/promises");
const object_fromentries_1 = __importDefault(require("object.fromentries"));
const logger_1 = require("porygon/logger");
const config_1 = require("porygon/config");
const map_1 = require("./map");
const logger = logger_1.createLogger('asset', logger_1.colors.green);
const CACHE_FILE = 'assets/upload_cache.json';
const UPLOAD_GUILD = config_1.config('assets.upload_dump.guild');
const UPLOAD_CHANNEL = config_1.config('assets.upload_dump.channel');
let done = false;
function assetSetupIsDone() {
    return done;
}
exports.assetSetupIsDone = assetSetupIsDone;
async function setupAssets(client) {
    // ensure all assets are loaded
    await Promise.resolve().then(() => __importStar(require('../assets')));
    const [cache, channel] = await Promise.all([
        fetchUploadCache(),
        fetchUploadChannel(client),
    ]);
    const lastRun = cache?.lastRun ?? 0;
    let shouldCreateNextUploadCache = !cache;
    for (const asset of map_1.eachAsset()) {
        const { mtime } = await promises_1.stat(asset.path);
        if (cache?.urls[asset.path] && mtime.getTime() <= lastRun) {
            asset.url = cache.urls[asset.path];
            continue;
        }
        logger.info(`Uploading asset ${asset.path}...`);
        const message = await channel.send({ files: [asset.path] });
        const attachment = message.attachments.first();
        asset.url = attachment.url;
        shouldCreateNextUploadCache = true;
    }
    if (shouldCreateNextUploadCache) {
        await createNextUploadCache();
    }
    done = true;
}
exports.setupAssets = setupAssets;
function fetchUploadChannel(client) {
    const guild = client.guilds.cache.get(UPLOAD_GUILD.value);
    return guild.channels.cache.get(UPLOAD_CHANNEL.value);
}
exports.fetchUploadChannel = fetchUploadChannel;
function fetchUploadCache() {
    return Promise.resolve().then(() => __importStar(require(`../../../${CACHE_FILE}`))).then((cache) => {
        logger.info('Fetched asset cache...');
        return cache;
    })
        .catch(() => {
        logger.warn('No asset upload cache found, creating a new one.');
        return null;
    });
}
async function createNextUploadCache() {
    const urls = object_fromentries_1.default(map_1.mapAssets((asset) => [asset.path, asset.url]));
    const cache = { lastRun: Date.now(), urls };
    const json = JSON.stringify(cache, null, 2);
    await promises_1.writeFile(CACHE_FILE, json);
}
