// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires, quotes */

const inquirer = require('inquirer');
const { writeFile } = require('fs/promises');
const util = require('./_util.js');

/**
 * @typedef {{ cmd: string, plug: string }} Structure
 */

async function main() {
  const plugins = await util.getPluginNames();
  const structure = /** @type Structure */ (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'cmd',
        message: 'Enter the name of the event:',
        validate: util.presence,
      },
      {
        type: 'list',
        name: 'plug',
        message: 'Enter the plugin to include this command in:',
        choices: plugins,
      },
    ])
  );

  await util.createPluginDir(structure.plug, 'events');

  const file = `./src/plugins/${structure.plug}/events/${structure.cmd}.ts`;
  const contents = [
    `import { EventFactory } from 'porygon/plugin';`,
    ``,
    `type Kind = typeof import('../$plugin').default;`,
    ``,
    `const handler: EventFactory<Kind> = ({ events }) => {`,
    `  // TODO: add events`,
    `};`,
    ``,
    `export default handler;`,
    ``,
  ].join('\n');

  writeFile(file, contents);
  util.exportFrom$Plugin(
    structure.plug,
    `events/${structure.cmd}`,
    'event',
    structure.cmd,
  );
}

main();
