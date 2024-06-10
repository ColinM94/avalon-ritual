export type Player = {
  id: string;
  name: string;
  joinedAt: number;
  isHost: boolean;
  isReady: boolean;
};

export type Lobby = {
  id: string;
  name: string;
  players: Record<string, Player>;
  numPlayers: number;
};
