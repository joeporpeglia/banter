export enum Actions {
  JoinGame = 'JoinGame',
  PlayerJoined = 'PlayerJoined',
  PlayerLeft = 'PlayerLeft',
  LeaveGame = 'LeaveGame',
  LoadGame = 'LoadGame',
  AddPrompt = 'AddPrompt',
  PromptAdded = 'PromptAdded',
}

export type JoinGame = {
  playerName: string;
  gameId: string;
};

export type Player = {
  playerName: string;
};

export type LobbyView = {
  status: 'Lobby';
  players: Player[];
  numberOfPrompts: number;
};

export type PlayerView = LobbyView;

export type Prompt = {
  promptId: string;
  text: string;
};
