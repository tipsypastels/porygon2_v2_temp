type Render<P extends Player> = (game: BaseRPS<P>) => void;
type End = () => void;

interface Player {
  id: string;
  toString(): string;
}

interface Opts<P extends Player> {
  player1: P;
  player2: P;
  render: Render<P>;
  end: End;
}

export class BaseRPS<P extends Player> {}
