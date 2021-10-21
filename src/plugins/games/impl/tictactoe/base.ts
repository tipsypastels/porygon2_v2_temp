// TODO

type Render = (game: BaseTicTacToe) => void | Promise<void>;
type End = () => void;

/** @internal */
export type State =
  | { kind: 'won'; winner: Team }
  | { kind: 'tie' }
  | { kind: 'ongoing' }
  | { kind: 'cancelled' };

/** @internal */
export enum Team {
  X,
  O,
}

/** @internal */
export interface PlayerData {
  id: string;
  toString(): string;
}

interface Opts {
  players: [PlayerData, PlayerData];
  render: Render;
  end: End;
}

/** @internal */
export class BaseTicTacToe {
  state: State = { kind: 'ongoing' };

  readonly players: [Player, Player];
  readonly render: Render;
  readonly end: End;

  constructor({ players: [pX, pO], render, end }: Opts) {
    this.players = [new Player(pX, Team.X), new Player(pO, Team.O)];
    this.render = render;
    this.end = end;
  }
}

class Player {
  constructor(private data: PlayerData, private team: Team) {}

  equals(other: Player) {
    this.data.id === other.data.id;
  }

  toString() {
    return this.data.toString();
  }
}
