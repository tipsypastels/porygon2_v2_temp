import { config, setConfig } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { CommandFn, commandGroups } from 'porygon/interaction';
import { assertOwner } from 'porygon/owner';
import { code, codeBlock } from 'support/string';

type GetOpts = { key: string };
type SetOpts = { key: string; value: string };
type UpdateOpts = { key: string; expression: string };

const get: CommandFn<GetOpts> = async ({ opts, intr, embed }) => {
  const key = opts.get('key');
  const { value } = config(key as any);

  embed
    .poryColor('info')
    .setTitle('Config')
    .addField('Key', code(key))
    .addField('Value', codeBlock(value, { inspect: true, lang: 'js' }));

  await intr.reply({ embeds: [embed] });
};

const set: CommandFn<SetOpts> = async ({ opts, intr, embed }) => {
  const { key, value: rawValue } = opts.pick('key', 'value');

  await parse(rawValue)
    .then((value) => {
      setConfig(key, value);

      embed
        .poryColor('ok')
        .setTitle('Config updated!')
        .addField('Key', code(key))
        .addField('New Value', codeBlock(value, { lang: 'js' }));

      return intr.reply({ embeds: [embed] });
    })
    .catch(() => {
      embed
        .poryColor('error')
        .setTitle('JSON was badly formed. Please try that again.')
        .setDescription(codeBlock(rawValue, { lang: 'json' }));

      return intr.reply({ embeds: [embed], ephemeral: true });
    });
};

const update: CommandFn<UpdateOpts> = async ({ opts, intr, embed, author }) => {
  assertOwner(author);

  const { key, expression } = opts.pick('key', 'expression');
  const { value: currentValue } = await config(key as any);
  const nextValue = evaluate(expression, currentValue);

  setConfig(key, nextValue);

  embed
    .poryColor('ok')
    .setTitle('Config updated!')
    .addField('Key', code(key))
    .addField('New Value', codeBlock(nextValue, { lang: 'js' }));

  await intr.reply({ embeds: [embed] });
};

const cfg = commandGroups({ get, set, update });

cfg.data = {
  name: 'cfg',
  description: 'Gets or sets a Porygon configuration value by its internal ID.',
  defaultPermission: DEV,
  options: [
    {
      name: 'get',
      type: 'SUB_COMMAND',
      description: 'Gets a configuration value.',
      options: [
        {
          name: 'key',
          type: 'STRING',
          required: true,
          description: 'The ID of the value to find.',
        },
      ],
    },

    {
      name: 'set',
      type: 'SUB_COMMAND',
      description: 'Sets a configuration value.',
      options: [
        {
          name: 'key',
          type: 'STRING',
          required: true,
          description: 'The ID of the value to set.',
        },
        {
          name: 'value',
          type: 'STRING',
          required: true,
          description: 'An expression that evaluates to a new value.',
        },
      ],
    },
    {
      name: 'update',
      type: 'SUB_COMMAND',
      description: 'Updates a configuration value by evaluating a JavaScript expression.',
      options: [
        {
          name: 'key',
          type: 'STRING',
          required: true,
          description: 'The ID of the value to update.',
        },
        {
          name: 'expression',
          type: 'STRING',
          required: true,
          description: 'The value to update to.',
        },
      ],
    },
  ],
};

export default cfg;

async function parse(code: string) {
  return JSON.parse(code);
}

function evaluate(expr: string, thisValue: any) {
  return new Function(`return ${expr}`).call(thisValue);
}
