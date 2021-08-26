import { Message } from 'discord.js';
import { ctIncrementScore } from './score';
import { CtConfig } from './shared';

export function ctHandleMessage(message: Message) {
  if (message.author.bot || !CtConfig.enabled) {
    return;
  }

  const { member } = message;
  const points = pointsFor(message);

  if (!member || !points) {
    return;
  }

  ctIncrementScore(member, points);
}

function pointsFor(message: Message) {
  return CtConfig.ppmExceptions[message.channelId] ?? 1;
}
