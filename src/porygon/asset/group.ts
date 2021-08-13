import { Collection } from 'discord.js';
import { InclusiveRange } from 'support/range';
import { Asset, AssetName } from './asset';

export type AssetGroupKey<G> = G extends AssetGroup<infer K> ? K : never;

type File<K> = readonly [name: K, ext: string];

export class AssetGroup<K extends AssetName> {
  private assets = new Collection<K, Asset>();

  static range(end: number, ext: string) {
    return new InclusiveRange(0, end).map((i) => <const>[i, ext]);
  }

  constructor(dir: string, files: readonly File<K>[]) {
    for (const [name, ext] of files) {
      const asset = new Asset(dir, name, ext);
      this.assets.set(name, asset);
    }
  }

  *[Symbol.iterator]() {
    for (const [, asset] of this.assets) {
      yield asset;
    }
  }

  get(key: K) {
    return this.assets.get(key)!;
  }

  random() {
    return this.assets.random();
  }
}
