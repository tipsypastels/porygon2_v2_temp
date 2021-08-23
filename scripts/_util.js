// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */

const { readdir, appendFile } = require('fs/promises');

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
