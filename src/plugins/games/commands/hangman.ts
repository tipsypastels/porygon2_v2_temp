import { Command } from 'porygon/interaction';
import { Hangman } from '../impl/hangman';

const hangman: Command = async ({ channel, intr }) => {
  const game = new Hangman({ channel, intr });
  await game.start();
};

hangman.data = {
  name: 'hangman',
  description: 'Starts a hangman game.',
};

export default hangman;
