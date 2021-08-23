// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires, quotes */

const inquirer = require('inquirer');
const { appendFile, writeFile, mkdir } = require('fs/promises');
const util = require('./_util.js');

/**
 * @typedef {{ name: string }} Base
 * @typedef {Base & { kind: 'global' }} Global
 * @typedef {Base & { kind: 'guild', guildName: string }} Guild
 * @typedef {Base & { kind: 'guilds', guildNames: string[] }} Guilds
 * @typedef {Global | Guild | Guilds} Structure
 */

async function main() {
  const guildNames = getGuildNames();
  const structure = /** @type Structure */ (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the plugin:',
        validate: util.presence,
      },
      {
        type: 'list',
        name: 'kind',
        message: 'Enter the kind of plugin:',
        choices: ['global', 'guild', 'guilds'],
      },
      {
        type: 'list',
        name: 'guildName',
        message: 'Choose the guild to upload to:',
        choices: guildNames,
        when: (s) => s.kind === 'guild',
      },
      {
        type: 'checkbox',
        name: 'guildNames',
        message: 'Choose the guilds to upload to:',
        choices: guildNames,
        when: (s) => s.kind === 'guilds',
      },
    ])
  );

  const dir = `src/plugins/${structure.name}`;
  const needsConfigImport = structure.kind !== 'global';
  const ctor = `Plugin${structure.kind[0].toUpperCase() + structure.kind.slice(1)}`;
  const init = getKindInit(ctor, structure);

  const contents = [
    `import { ${ctor} } from 'porygon/plugin';`,
    ``,
    `export default ${init};`,
    ``,
  ];

  if (needsConfigImport) {
    contents.splice(1, 0, `import { config } from 'porygon/config';`);
  }

  await mkdir(dir);
  await writeFile(`${dir}/$plugin.ts`, contents.join('\n'));

  const reExport = `export * as ${structure.name} from './${structure.name}/$plugin';\n`;
  await appendFile(`src/plugins/$plugins.ts`, reExport);
}

main();

function getGuildNames() {
  const config = require('../src/porygon/config_data.json');
  return Object.keys(config.guilds);
}

/**
 * @param {string} ctor
 * @param {Structure} structure
 */
function getKindInit(ctor, structure) {
  switch (structure.kind) {
    case 'global': {
      return `${ctor}.init()`;
    }
    case 'guild': {
      return `${ctor}.init(config('guilds.${structure.guildName}').value)`;
    }
    case 'guilds': {
      const configs = structure.guildNames.map((c) => `config('guilds.${c}).value`);
      return `${ctor}.init(config([${configs.join(', ')}]))`;
    }
  }
}
