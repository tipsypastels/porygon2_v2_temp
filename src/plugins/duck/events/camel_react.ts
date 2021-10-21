import { Message } from 'discord.js';
import { EventFactory } from 'porygon/plugin';
import { getCamelResponseForMessage } from '../impl/camel';

type Kind = typeof import('../$plugin').default;

const handler: EventFactory<Kind> = ({ events }) => {
  events.on('messageCreate', handle);
};

export default handler;

function handle(message: Message) {
  const response = getCamelResponseForMessage(message.content);

  if (response) {
    message.channel.send(response);
  }
}
