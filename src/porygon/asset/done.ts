// this file can't be in setup.ts or we get a circular dependency wheee
let done = false;

export function markAssetSetupAsDone() {
  done = true;
}

export function assetSetupIsDone() {
  return done;
}
