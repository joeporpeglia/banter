import { Player } from './Player';
import { GameAction, ActionTypes } from './GameAction';

export type LobbyView = {
  status: 'Lobby';
  players: Player[];
  numberOfPrompts: number;
};

export type PlayerView = LobbyView;

export function updatePlayerView(
  prevState: PlayerView,
  action: GameAction,
): PlayerView {
  switch (action.type) {
    case ActionTypes.JoinGame:
    case ActionTypes.PlayerJoined:
      return {
        ...prevState,
        players: prevState.players.concat(action.player),
      };
    case ActionTypes.PlayerLeft:
      return {
        ...prevState,
        players: prevState.players.filter(
          (p) => p.playerName !== action.player.playerName,
        ),
      };
    case ActionTypes.LoadGame:
      return action.view;
    default:
      return prevState;
  }
}
