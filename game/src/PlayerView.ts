import { Player } from './Player';
import { GameAction, ActionTypes } from './GameAction';
import { Game, Games } from './Game';

export type LobbyView = {
  status: 'Lobby';
  players: Player[];
  numberOfPrompts: number;
};

export type PlayerView = LobbyView;

export const PlayerViews = {
  viewForPlayer(game: Game, player: Player): PlayerView {
    switch (game.status) {
      case 'Lobby':
        return viewLobby(game, player);

      case 'PlayerTurn':
      case 'Review':
        return {
          status: 'Lobby',
          players: [],
          numberOfPrompts: 0,
        };
    }
  },

  updateView(prevState: PlayerView, action: GameAction): Readonly<PlayerView> {
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
      case ActionTypes.AddPrompt:
      case ActionTypes.PromptAdded:
        return {
          ...prevState,
          numberOfPrompts: prevState.numberOfPrompts + 1,
        };
      default:
        return prevState;
    }
  },
};

function viewLobby(game: Game, _: Player): LobbyView {
  const lobby = Games.getLobby(game);
  return {
    status: 'Lobby',
    players: lobby.players,
    numberOfPrompts: lobby.prompts.length,
  };
}
