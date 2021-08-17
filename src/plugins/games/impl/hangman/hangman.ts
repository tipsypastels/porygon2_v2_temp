import { CommandInteraction, MessageCollector, Snowflake } from 'discord.js';
import { HANGMAN_ASSETS } from 'porygon/assets';
import { config } from 'porygon/config';
import { DEV } from 'porygon/dev';
import { Embed } from 'porygon/embed';
import { createBuiltinErrors } from 'porygon/error';
import { CommandChannel } from 'porygon/interaction';
import { createLang } from 'porygon/lang';
import { random } from 'support/array';
import { codeBlock } from 'support/string';
import { Minutes } from 'support/time';
import { BaseHangman, State } from './base';

type Renderer = (embed: Embed, game: BaseHangman) => void;

interface Opts {
  intr: CommandInteraction;
  channel: CommandChannel;
}

const ACTIVE_CHANNELS = new Set<Snowflake>();
const TIMEOUT = Minutes(DEV ? 1 : 10);
const LIFETIME = 10;
const WORDS = config('pkg.games.hangman.words');

/**
 * @see BaseHangman for the implementation.
 * This is a high-level wrapper that applies Discord semantics.
 */
export class Hangman {
  private intr: CommandInteraction;
  private channel: CommandChannel;
  private game: BaseHangman;
  private collector: MessageCollector;
  private cancellation: NodeJS.Timeout;

  constructor(opts: Opts) {
    assertAvailableChannel(opts.channel);

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

    this.cancellation = setTimeout(() => this.game.cancel(), TIMEOUT);
  }

  async start() {
    await this.render(this.game);
  }

  private render = async (game: BaseHangman) => {
    const stateRenderer = stateRenderers[game.state];
    const embed = new Embed()
      .mergeWith(wordRenderer, game)
      .mergeWith(nooseRenderer, game)
      .mergeWith(stateRenderer, game);

    await this.reply(embed);
  };

  private end = () => {
    this.collector.stop();
    clearTimeout(this.cancellation);
    ACTIVE_CHANNELS.delete(this.channel.id);
  };

  private reply(embed: Embed) {
    if (this.intr.replied) {
      this.intr.editReply({ embeds: [embed] });
    } else {
      this.intr.reply({ embeds: [embed] });
    }
  }
}

function getRandomWord() {
  return random(WORDS.value);
}

const stateRenderers: Record<State, Renderer> = {
  [State.Ongoing](embed, game) {
    embed
      .poryColor('info')
      .setTitle(lang('ongoing.title'))
      .addField(lang('ongoing.printed'), game.word.length.toString());
  },

  [State.Won](embed) {
    embed.poryColor('ok').setTitle(lang('won.title'));
  },

  [State.Lost](embed, game) {
    embed
      .poryColor('warning')
      .setTitle(lang('lost.title'))
      .addField(lang('was'), game.word)
      .setFooter(lang('lost.blurb'));
  },

  [State.Cancelled](embed, game) {
    embed
      .poryColor('danger')
      .setTitle(lang('cancelled.title'))
      .addField(lang('was'), game.word);
  },
};

const nooseRenderer: Renderer = (embed, game) => {
  embed.setThumbnail(HANGMAN_ASSETS.get(game.invalidGuesses).url);
};

const wordRenderer: Renderer = (embed, game) => {
  embed.setDescription(codeBlock(game.toPrintedWord()));
};

function assertAvailableChannel(channel: CommandChannel) {
  if (ACTIVE_CHANNELS.has(channel.id)) {
    throw error('hangmanChannelBusy');
  }

  ACTIVE_CHANNELS.add(channel.id);
}

const lang = createLang(<const>{
  was: 'The word was',
  busy: {
    title: 'A hangman game is already in progress in this channel.',
    desc: 'Please finish it or wait for it to conclude.',
  },
  ongoing: {
    title: 'Hangman',
    printed: 'Letters',
  },
  won: {
    title: 'Hangman - you won!',
  },
  lost: {
    title: 'Hangman - you lost!',
    blurb: 'Press F to pay respects to Porygon.',
  },
  cancelled: {
    title: 'Hangman - timed out!',
    blurb: 'Games time out after 10 minutes of inactivity.',
  },
});

const error = createBuiltinErrors({
  hangmanChannelBusy(e) {
    e.poryErr('danger').setTitle(lang('busy.title')).setDescription(lang('busy.desc'));
  },
});
