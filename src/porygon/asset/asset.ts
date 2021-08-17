import { createLang } from 'porygon/lang';
import { assetCache } from './map';
import { assetSetupIsDone } from './setup';

export type AssetName = string | number;

export class Asset {
  private _url = '';

  constructor(readonly dir: string, readonly name: AssetName, readonly ext: string) {
    if (assetSetupIsDone()) {
      throw new Error(lang('dynCreate'));
    }

    assetCache(this);
  }

  get path() {
    return `./assets/${this.dir}/${this.name}.${this.ext}`;
  }

  get url() {
    return this._url;
  }

  set url(url) {
    if (assetSetupIsDone()) {
      throw new Error(lang('dynSetUrl'));
    }

    this._url = url;
  }
}

const lang = createLang(<const>{
  dynCreate: "Can't create assets dynamically. All assets must be created during setup.",
  dynSetUrl: "Can't set asset URLs dynamically! All URLs must be fixed during setup.",
});
