export type Player = {
  playerId: string;
  playerName: string;
};

export type Prompt = {
  promptId: string;
  text: string;
};

export type Lobby = {
  status: 'Lobby';
  players: Player[];
  prompts: Prompt[];
  playerReadyStatus: Record<string, boolean>;
};

export type PlayerTurn = {
  status: 'PlayerTurn';
};

export type Review = {
  status: 'Review';
};

export type Game = Lobby | PlayerTurn | Review;

export type LobbyView = {
  status: 'Lobby';
  activePlayerId: string;
  players: Player[];
  numberOfPrompts: number;
  playerReadyStatus: Record<string, boolean>;
};

export type PlayerView = LobbyView;

export enum GameActions {
  JoinGame = 'JoinGame',
  AddPrompt = 'AddPrompt',
  RemovePrompt = 'RemovePrompt',
  SetReady = 'SetReady',
  QuitGame = 'QuitGame',
}

export type JoinGame = {
  type: GameActions.JoinGame;
  gameId: string;
  player: Player;
};

export type AddPrompt = {
  type: GameActions.AddPrompt;
  prompt: Prompt;
};

export type RemovePrompt = {
  type: GameActions.RemovePrompt;
  promptId: string;
};

export type SetReady = {
  type: GameActions.SetReady;
  isReady: boolean;
};

export type GameAction = JoinGame | AddPrompt | RemovePrompt | SetReady;

export enum GameEvents {
  GameJoined = 'GameJoined',
  PlayerJoined = 'PlayerJoined',
  PlayerLeft = 'PlayerLeft',
  PromptAdded = 'PromptAdded',
  PromptRemoved = 'PromptRemoved',
  PlayerReadyChanged = 'PlayerReadyChanged',
}

export type PlayerJoined = {
  type: GameEvents.PlayerJoined;
  player: Player;
};

export type PlayerLeft = {
  type: GameEvents.PlayerLeft;
  player: Player;
};

export type GameJoined = {
  type: GameEvents.GameJoined;
  view: PlayerView;
};

export type PromptAdded = {
  type: GameEvents.PromptAdded;
};

export type PromptRemoved = {
  type: GameEvents.PromptRemoved;
};

export type PlayerReadyChanged = {
  type: GameEvents.PlayerReadyChanged;
  playerId: string;
  isReady: boolean;
};

export type GameEvent =
  | PlayerJoined
  | PlayerLeft
  | GameJoined
  | PromptAdded
  | PromptRemoved
  | PlayerReadyChanged;

export type GameEventDispatcher = {
  player(action: GameEvent): void;
  all(action: GameEvent): void;
  others(action: GameEvent): void;
};
