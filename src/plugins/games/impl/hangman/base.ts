import { Collection } from 'discord.js';

type Render = (game: BaseHangman) => void | Promise<void>;
type End = () => void;

/** @internal */
export enum State {
  Won,
  Lost,
  Ongoing,
  Cancelled,
}

/** @internal */
export enum Guess {
  Valid,
  Invalid,
}

interface Opts {
  word: string;
  lifetime: number;
  render: Render;
  end: End;
}

/**
 * The low-level version of a hangman game, which doesn't use any Discord-specific
 * semantics and is easily testable as a result.
 *
 * @internal
 */
export class BaseHangman {
  state = State.Ongoing;

  readonly word: string;
  readonly lifetime: number;
  private render: Render;
  private end: End;
  private guesses: Guesses;

  constructor({ word, lifetime, render, end }: Opts) {
    this.word = word;
    this.lifetime = lifetime;
    this.render = render;
    this.end = end;
    this.guesses = new Guesses(word, lifetime);
  }

  async call(content: string): Promise<[this, Guess | undefined]> {
    const [state, guess] = this.guess(content);
    this.state = state;

    if (this.state !== State.Ongoing) {
      this.end();
    }

    await this.render(this);
    return [this, guess];
  }

  async cancel() {
    if (this.state !== State.Ongoing) {
      return this;
    }

    this.end();
    this.state = State.Cancelled;

    await this.render(this);
    return this;
  }

  private guess(content: string): [State, Guess | undefined] {
    content = content.toLowerCase();

    if (content === this.word) {
      return [State.Won, Guess.Valid];
    }

    if (content.length === 1) {
      if (this.word.includes(content)) {
        this.guesses.set(content, Guess.Valid);
        return [this.guesses.didWin() ? State.Won : this.state, Guess.Valid];
      }

      this.guesses.set(content, Guess.Invalid);
      return [this.guesses.didLose() ? State.Lost : this.state, Guess.Invalid];
    }

    return [this.state, undefined];
  }

  isValid(content: string) {
    return content.toLowerCase() === this.word || content.length === 1;
  }

  get validGuesses() {
    return this.ofType(Guess.Valid);
  }

  get invalidGuesses() {
    return this.ofType(Guess.Invalid);
  }

  private ofType(guess: Guess) {
    return this.guesses.ofType(guess);
  }

  toPrintedWord() {
    if (this.state === State.Won) {
      return this.word;
    }

    return this.guesses.toPrintedWord();
  }
}

class Guesses {
  private collection = new Collection<string, Guess>();
  private chars: Set<string>;

  constructor(private word: string, private lifetime: number) {
    this.chars = new Set([...this.word]);
  }

  set(char: string, guess: Guess) {
    this.collection.set(char, guess);
  }

  didWin() {
    return this.chars.size <= this.ofType(Guess.Valid);
  }

  didLose() {
    return this.lifetime <= this.ofType(Guess.Invalid);
  }

  ofType(type: Guess) {
    return this.collection.filter((x) => x === type).size;
  }

  toPrintedWord() {
    let buffer = '';

    for (const char of this.word) {
      buffer += this.collection.has(char) ? char : '_';
    }

    return buffer;
  }
}
