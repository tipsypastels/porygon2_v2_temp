// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires, quotes */

const inquirer = require('inquirer');
const { writeFile } = require('fs/promises');
const util = require('./_util.js');

/**
 * @typedef {{ cmd: string, plug: string, desc: ?string, groups: ?string }} Structure
 */

async function main() {
  const plugins = await util.getPluginNames();
  const structure = /** @type Structure */ (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'cmd',
        message: 'Enter the name of the command:',
        validate: util.presence,
      },
      {
        type: 'list',
        name: 'plug',
        message: 'Enter the plugin to include this command in:',
        choices: plugins,
      },
      {
        type: 'input',
        name: 'desc',
        message: '(Optional) Enter a description:',
      },
      {
        type: 'input',
        name: 'groups',
        message: '(Optional) Enter names of individual command groups, comma separated:',
      },
    ])
  );

  await util.createPluginDir(structure.plug, 'commands');

  if (structure.groups) {
    return createGroupCommand(structure);
  }

  createSimpleCommand(structure);
}

main();

/** @param {Structure} structure */
function createSimpleCommand(structure) {
  const id = toIdentifier(structure.cmd);
  const file = `./src/plugins/${structure.plug}/commands/${structure.cmd}.ts`;
  const desc = structure.desc || 'TODO: write a description';

  const contents = [
    `import { Command } from 'porygon/interaction';`,
    ``,
    `const ${id}: Command = async ({ opts, intr, embed }) => {`,
    `  // TODO: implement`,
    `};`,
    ``,
    `${id}.data = {`,
    `  name: ${quote(structure.cmd)},`,
    `  description: ${quote(desc)},`,
    `};`,
    ``,
    `export default ${id};`,
    ``,
  ].join('\n');

  writeFile(file, contents);
  exportFrom$Plugin(structure, id);
}

/** @param {Structure} structure */
function createGroupCommand(structure) {
  const id = toIdentifier(structure.cmd);
  const file = `./src/plugins/${structure.plug}/commands/${structure.cmd}.ts`;
  const desc = structure.desc || 'TODO: write a description';
  const groups = structure.groups.split(/ *, */);

  const groupFns = [];
  const groupOpts = [];

  for (const group of groups) {
    const gid = toIdentifier(group);

    groupFns.push(
      [
        `const ${gid}: CommandFn = async ({ opts, intr, embed }) => {`,
        `  // TODO: implement`,
        `};`,
      ].join('\n'),
    );
    groupOpts.push(
      [
        `    {`,
        `      name: ${quote(group)},`,
        `      description: 'TODO: describe subcommand',`,
        `      type: 'SUB_COMMAND',`,
        `    }`,
      ].join('\n'),
    );
  }

  const contents = [
    `import { CommandFn, commandGroups } from 'porygon/interaction';`,
    ``,
    groupFns.join('\n\n'),
    ``,
    `const ${id} = commandGroups({ ${groups.join(', ')} });`,
    ``,
    `${id}.data = {`,
    `  name: ${quote(structure.cmd)},`,
    `  description: ${quote(desc)},`,
    `  options: [`,
    groupOpts.join(',\n'),
    `  ],`,
    `};`,
    ``,
    `export default ${id};`,
  ].join('\n');

  writeFile(file, contents);
  exportFrom$Plugin(structure, id);
}

const IDENTIFIER = /^[$A-Z_][0-9A-Z_$]*$/i;

/** @param {string} token */
function toIdentifier(token) {
  if (token.match(IDENTIFIER)) return token;
  return `_${token}`;
}

/** @param {string} text  */
function quote(text) {
  if (text.includes("'")) return `"${text}"`;
  return `'${text}'`;
}

/**
 * @param {Structure} structure
 * @param {string} id
 */
function exportFrom$Plugin(structure, id) {
  util.exportFrom$Plugin(structure.plug, `commands/${structure.cmd}`, 'command', id);
}
