import { PlayerView } from './PlayerView';
import { Player } from './Player';

export enum ActionTypes {
  JoinGame = 'JoinGame',
  PlayerJoined = 'PlayerJoined',
  PlayerLeft = 'PlayerLeft',
  LeaveGame = 'LeaveGame',
  LoadGame = 'LoadGame',
  AddPrompt = 'AddPrompt',
  PromptAdded = 'PromptAdded',
}

export type JoinGame = {
  type: ActionTypes.JoinGame;
  gameId: string;
  player: Player;
};

export type PlayerJoined = {
  type: ActionTypes.PlayerJoined;
  player: Player;
};

export type PlayerLeft = {
  type: ActionTypes.PlayerLeft;
  player: Player;
};

export type LoadGame = {
  type: ActionTypes.LoadGame;
  view: PlayerView;
};

export type GameAction = JoinGame | PlayerJoined | PlayerLeft | LoadGame;
