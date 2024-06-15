import { GameSession, Player } from "types";

export interface Props {
  session: GameSession;
  players: Player[];
  isHost: boolean;
  className?: string;
}
