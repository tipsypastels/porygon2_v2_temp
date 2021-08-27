import { Message, TextChannel } from 'discord.js';
import { config } from 'porygon/config';
import { Embed } from 'porygon/embed';
import { createLang } from 'porygon/lang';
import { logger } from 'porygon/logger';
import { EventFactory } from 'porygon/plugin';
import { getLegacyCommandShim } from '../impl/shim_commands';

type Kind = typeof import('../$plugin').default;

const ENABLED = config('plug.pokecom.shimLegacyCommands');

const handler: EventFactory<Kind> = ({ events }) => {
  events.on('messageCreate', handle);
};

function handle(message: Message) {
  if (!ENABLED.value) {
    return;
  }

  if (!(message.channel instanceof TextChannel) || message.author.bot) {
    return;
  }

  const command = extractCommand(message);
  if (!command) return;

  logger.bug.warn(
    lang('log', {
      command,
      user: message.author.username,
      channel: message.channel.name,
    }),
  );

  const rec = getLegacyCommandShim(command);
  const embed = new Embed();

  embed.poryColor('danger').poryThumb('speech').assign(lang('embed'));
  if (rec) embed.addField(lang('rec', { command }), rec);

  message.channel.send({ embeds: [embed] });
}

export default handler;

const COMMAND = /^!(\w+)/;

function extractCommand(message: Message) {
  const match = COMMAND.exec(message.content);

  if (match) {
    return match[1].toLowerCase();
  }
}

const lang = createLang(<const>{
  log: '{user} used legacy !{command} in {channel}.',
  embed: {
    title: "Porygon's command handling has changed.",
    desc: "Porygon now uses Discord's shiny new *\\*~slash commands~\\** system. Slash commands start with a `/` and are displayed in the UI. Because of this, some old commands have been renamed or tweaked.",
  },
  rec: 'As for !{command}...',
});
