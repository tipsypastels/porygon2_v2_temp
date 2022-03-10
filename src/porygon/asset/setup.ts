import { TextChannel } from 'discord.js';
import { stat, writeFile } from 'fs/promises';
import fromEntries from 'object.fromentries';
import { Porygon } from 'porygon/core';
import { config } from 'porygon/config';
import { eachAsset, mapAssets } from './map';
import { markAssetSetupAsDone } from './done';
import { logger } from 'porygon/logger';

type UploadCache = {
  lastRun: number;
  urls: Record<string, string>;
};

const CACHE_FILE = 'assets/upload_cache.json';
const UPLOAD_GUILD = config('assets.uploadDump.guild');
const UPLOAD_CHANNEL = config('assets.uploadDump.channel');

export async function setupAssets(client: Porygon) {
  // ensure all assets are loaded
  await import('../assets');

  const [cache, channel] = await Promise.all([
    fetchUploadCache(),
    fetchUploadChannel(client),
  ]);

  if (!channel) {
    return;
  }

  const lastRun = cache?.lastRun ?? 0;

  let shouldCreateNextUploadCache = !cache;

  for (const asset of eachAsset()) {
    const { mtime } = await stat(asset.path);

    if (cache?.urls[asset.path] && mtime.getTime() <= lastRun) {
      asset.url = cache.urls[asset.path];
      continue;
    }

    logger.asset.info(`Uploading asset ${asset.path}...`);

    const message = await channel.send({ files: [asset.path] });
    const attachment = message.attachments.first()!;

    asset.url = attachment.url;

    shouldCreateNextUploadCache = true;
  }

  if (shouldCreateNextUploadCache) {
    await createNextUploadCache();
  }

  markAssetSetupAsDone();
}

export function fetchUploadChannel(client: Porygon) {
  const guild = client.guilds.cache.get(UPLOAD_GUILD.value);
  return guild?.channels.cache.get(UPLOAD_CHANNEL.value) as TextChannel | null;
}

function fetchUploadCache(): Promise<UploadCache | null> {
  return import(`../../../${CACHE_FILE}`)
    .then((cache: UploadCache) => {
      logger.asset.info('Fetched asset cache...');
      return cache;
    })
    .catch(() => {
      logger.asset.warn('No asset upload cache found, creating a new one.');
      return null;
    });
}

async function createNextUploadCache() {
  const urls = fromEntries(mapAssets((asset) => [asset.path, asset.url]));
  const cache: UploadCache = { lastRun: Date.now(), urls };
  const json = JSON.stringify(cache, null, 2);

  await writeFile(CACHE_FILE, json);
}
