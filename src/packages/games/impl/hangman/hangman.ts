import { CommandInteraction, MessageCollector } from 'discord.js';
import { HANGMAN_ASSETS } from 'porygon/assets';
import { config } from 'porygon/config';
import { Embed } from 'porygon/embed';
import { CommandChannel } from 'porygon/interaction';
import { random } from 'support/array';
import { codeBlock } from 'support/string';
import { BaseHangman, State } from './base';

interface Opts {
  intr: CommandInteraction;
  channel: CommandChannel;
}

/**
 * @see BaseHangman for the implementation.
 * This is a high-level wrapper that applies Discord semantics.
 */
export class Hangman {
  private intr: CommandInteraction;
  private channel: CommandChannel;
  private game: BaseHangman;
  private collector: MessageCollector;

  constructor(opts: Opts) {
    this.intr = opts.intr;
    this.channel = opts.channel;

    this.game = new BaseHangman({
      word: getRandomWord(),
      lifetime: LIFETIME,
      render: this.render,
      end: this.end,
    });

    this.collector = this.channel.createMessageCollector({
      filter: (m) => {
        return this.game.isValid(m.content);
      },
    });

    this.collector.on('collect', (m) => {
      this.game.call(m.content);
    });
  }

  async start() {
    await this.render(this.game);
  }

  private render = async (game: BaseHangman) => {
    const embed = new Embed();
    const stateRenderer = stateRenderers[game.state];

    wordRenderer(embed, game);
    nooseRenderer(embed, game);
    stateRenderer(embed, game);

    await this.reply(embed);
  };

  private end = () => {
    this.collector.stop();
  };

  private reply(embed: Embed) {
    if (this.intr.replied) {
      this.intr.editReply({ embeds: [embed] });
    } else {
      this.intr.reply({ embeds: [embed] });
    }
  }
}

const WORDS = config('pkg.games.hangman.words');
const LIFETIME = 10;

function getRandomWord() {
  return random(WORDS.value);
}

type StateRenderer = (embed: Embed, game: BaseHangman) => void;
const stateRenderers: Record<State, StateRenderer> = {
  [State.Ongoing](embed, game) {
    embed
      .setTitle('Hangman')
      .poryColor('info')
      .addField('Letters', game.word.length.toString());
  },

  [State.Won](embed) {
    embed.setTitle('Hangman - you won!').poryColor('ok');
  },

  [State.Lost](embed, game) {
    embed
      .setTitle('Hangman - you lost!')
      .poryColor('warning')
      .addField('The word was', game.word)
      .setFooter('Press F to pay respects to Porygon.');
  },
};

const nooseRenderer: StateRenderer = (embed, game) => {
  embed.setThumbnail(HANGMAN_ASSETS.get(game.invalidGuesses).url);
};

const wordRenderer: StateRenderer = (embed, game) => {
  embed.setDescription(codeBlock(game.toPrintedWord()));
};
