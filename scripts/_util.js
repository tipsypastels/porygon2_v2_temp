// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const { mkdir, access, readdir, appendFile } = require('fs/promises');

exports.presence = (x) => !!x;

/**
 * @param {string} plugin
 * @param {string} file
 * @param {string} type
 * @param {string} id
 */
exports.exportFrom$Plugin = function (plugin, file, type, id) {
  type = type.toUpperCase();

  const path = `./src/plugins/${plugin}/$plugin.ts`;
  const content = `export { default as ${type}_${plugin}_${id} } from './${file}';\n`;

  return appendFile(path, content);
};

exports.getPluginNames = async function () {
  const dirs = await readdir('./src/plugins');
  return dirs.filter((x) => !x.startsWith('_') && !x.startsWith('$'));
};

/**
 *
 * @param {string} plugin
 * @param {string} dir
 */
exports.createPluginDir = async function (plugin, dir) {
  const path = `./src/plugins/${plugin}/${dir}`;
  if (await exists(path)) {
    return;
  }

  await mkdir(path);
};

/** @param {string} file */
function exists(file) {
  return access(file)
    .then(() => true)
    .catch(() => false);
}
