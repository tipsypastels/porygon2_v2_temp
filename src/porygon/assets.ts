import { AssetGroup } from './asset';

export const COIN_ASSETS = new AssetGroup('coins', <const>[
  ['heads', 'png'],
  ['tails', 'png'],
]);

export const PORY_ASSETS = new AssetGroup('unused/pory_thumbs_v2', <const>[
  ['8ball', 'png'],
  ['angry', 'png'],
  ['danger', 'png'],
  ['error', 'png'],
  ['plead', 'png'],
  ['smile', 'png'],
  ['speech', 'png'],
  ['thanos', 'png'],
  ['vibe', 'png'],
  ['warning', 'png'],
]);

export const PORY_ASSETS_V3 = new AssetGroup('pory', <const>[
  ['plead', 'png'],
  ['smile', 'png'],
]);

export const HANGMAN_ASSETS = new AssetGroup('hangman', AssetGroup.range(10, 'png'));
export const HEADPAT_ASSETS = new AssetGroup('headpats', AssetGroup.range(33, 'gif'));

export const EXPERIMENT_ASSETS = new AssetGroup('experiments', <const>[
  ['potenuse', 'jpg'],
]);
