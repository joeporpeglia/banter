import {
  GameAction,
  GameActions,
  GameEvent,
  GameEvents,
  PlayerView,
} from './Game';
import { assertNever } from './assertNever';

export function updatePlayerView(
  playerView: PlayerView,
  action: GameAction | GameEvent,
): PlayerView {
  switch (action.type) {
    case GameActions.JoinGame:
    case GameEvents.PlayerJoined:
      return {
        ...playerView,
        players: playerView.players.concat(action.player),
      };
    case GameEvents.PlayerLeft:
      return {
        ...playerView,
        players: playerView.players.filter(
          (p) => p.playerName !== action.player.playerName,
        ),
      };
    case GameEvents.GameJoined:
      return action.view;

    case GameActions.AddPrompt:
    case GameEvents.PromptAdded:
      return {
        ...playerView,
        numberOfPrompts: playerView.numberOfPrompts + 1,
      };

    case GameActions.RemovePrompt:
    case GameEvents.PromptRemoved:
      return {
        ...playerView,
        numberOfPrompts: playerView.numberOfPrompts - 1,
      };

    case GameActions.SetReady:
    case GameEvents.PlayerReadyChanged:
      return {
        ...playerView,
        playerReadyStatus: {
          ...playerView.playerReadyStatus,
          [action.type === GameActions.SetReady
            ? playerView.activePlayerName
            : action.playerName]: action.isReady,
        },
      };

    default:
      assertNever(action);
  }
}
