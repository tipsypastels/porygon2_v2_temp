import { BaseHangman, Guess, State } from './base';

// eslint-disable-next-line
const noop = () => {};

const DEFAULT_WORD = 'alpaca';
const DEFAULT_WORD_UNGUESSED = '______';
const DEFAULT_LIFETIME = 3;

function h(word = DEFAULT_WORD, lifetime = DEFAULT_LIFETIME) {
  return new BaseHangman({ word, lifetime, render: noop, end: noop });
}

describe(BaseHangman, () => {
  it('creates a hangman game', () => {
    const game = h();

    expect(game.word).toBe(DEFAULT_WORD);
    expect(game.toPrintedWord()).toBe(DEFAULT_WORD_UNGUESSED);
  });

  describe('guessing', () => {
    it('allows guessing letters', async () => {
      const game = h();
      const [, guess] = await game.call('p');

      expect(guess).toBe(Guess.Valid);
      expect(game.toPrintedWord()).toBe('__p___');
    });

    it('allows guessing letters that appear multiple times', async () => {
      const game = h();
      const [, guess] = await game.call('a');

      expect(guess).toBe(Guess.Valid);
      expect(game.toPrintedWord()).toBe('a__a_a');
    });

    it('allows guessing letters that do not appear', async () => {
      const game = h();
      const [, guess] = await game.call('z');

      expect(guess).toBe(Guess.Invalid);
      expect(game.toPrintedWord()).toBe(DEFAULT_WORD_UNGUESSED);
    });

    it('allows guessing the full word', async () => {
      const game = h();
      const [, guess] = await game.call(DEFAULT_WORD);

      expect(guess).toBe(Guess.Valid);
      expect(game.toPrintedWord()).toBe(DEFAULT_WORD);
    });

    it('ignores meaningless guesses', async () => {
      const game = h();
      const [, guess] = await game.call('xychromium');

      expect(guess).toBeUndefined();
      expect(game.toPrintedWord()).toBe(DEFAULT_WORD_UNGUESSED);
    });
  });

  describe('state', () => {
    it('starts in the ongoing state', async () => {
      const game = h();
      expect(game.state).toBe(State.Ongoing);
    });

    it('continues in that state as guesses occur', async () => {
      const game = h();
      await game.call('a');
      expect(game.state).toBe(State.Ongoing);
    });

    it('ends after the number of incorrect reaches exceeds the lifetime', async () => {
      const game = h();

      await game.call('x');
      await game.call('y');

      expect(game.state).toBe(State.Ongoing);

      await game.call('z');

      expect(game.state).toBe(State.Lost);
    });

    it('ignores repeated wrong guesses', async () => {
      const game = h();

      await game.call('x');
      await game.call('y');

      expect(game.state).toBe(State.Ongoing);

      await game.call('y');

      expect(game.state).toBe(State.Ongoing);

      await game.call('z');

      expect(game.state).toBe(State.Lost);
    });

    it('ends after the correct word is guessed', async () => {
      const game = h();

      await game.call('a');
      await game.call('l');
      await game.call('p');

      expect(game.state).toBe(State.Ongoing);

      await game.call('c');

      expect(game.state).toBe(State.Won);
    });

    it('ignores repeated right guesses', async () => {
      const game = h();

      await game.call('a');
      await game.call('l');
      await game.call('p');

      expect(game.state).toBe(State.Ongoing);

      await game.call('p');

      expect(game.state).toBe(State.Ongoing);

      await game.call('c');

      expect(game.state).toBe(State.Won);
    });

    it('ends immediately if the full word is guessed', async () => {
      const game = h();

      await game.call(DEFAULT_WORD);

      expect(game.state).toBe(State.Won);
    });

    it('does not change on nonsense guesses', async () => {
      const game = h();

      await game.call('xychromium');

      expect(game.state).toBe(State.Ongoing);
    });
  });
});
