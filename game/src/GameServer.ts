import { assertNever } from './assertNever';
import {
  Game,
  GameAction,
  GameActions,
  GameEventDispatcher,
  GameEvents,
  getLobby,
  JoinGame,
  Player,
  Prompt,
  viewGame,
} from './Game';

export type GameSession = {
  handleAction(action: GameAction): void;
  close(): void;
};

const games: Record<string, Game> = {};

export function createSession(
  joinGame: JoinGame,
  dispatcher: GameEventDispatcher,
): GameSession {
  const { gameId, player } = joinGame;
  const game = getOrCreate(gameId);
  addPlayer(game, player);
  dispatcher.others({
    type: GameEvents.PlayerJoined,
    player,
  });
  dispatcher.player({
    type: GameEvents.GameJoined,
    view: viewGame(game, player),
  });

  return {
    handleAction(action) {
      switch (action.type) {
        case GameActions.AddPrompt:
          addPrompt(game, action.prompt);
          dispatcher.others({
            type: GameEvents.PromptAdded,
          });
          break;
        case GameActions.RemovePrompt:
          removePrompt(game, action.promptId);
          dispatcher.others({
            type: GameEvents.PromptRemoved,
          });
          break;

        case GameActions.JoinGame:
          throw new Error('Already joined a game');

        case GameActions.SetReady:
          setPlayerReady(game, player, action.isReady);
          dispatcher.others({
            type: GameEvents.PlayerReadyChanged,
            playerName: player.playerName,
            isReady: action.isReady,
          });
          break;

        default:
          assertNever(action);
      }
    },
    close() {
      removePlayer(game, player);
      dispatcher.others({
        type: GameEvents.PlayerLeft,
        player,
      });
    },
  };
}

function getOrCreate(id: string): Game {
  if (!games[id]) {
    games[id] = {
      status: 'Lobby',
      players: [],
      prompts: [],
      playerReadyStatus: {},
    };
  }

  return games[id];
}

function addPlayer(game: Game, player: Player): void {
  getLobby(game).players.push(player);
}

function removePlayer(game: Game, player: Player): void {
  const lobby = getLobby(game);
  lobby.players = lobby.players.filter((p) => p !== player);
}

function addPrompt(game: Game, prompt: Prompt): void {
  const lobby = getLobby(game);
  lobby.prompts.push(prompt);
}

function removePrompt(game: Game, promptId: string): void {
  const lobby = getLobby(game);
  lobby.prompts = lobby.prompts.filter((p) => p.promptId !== promptId);
}

function setPlayerReady(game: Game, player: Player, isReady: boolean): void {
  const lobby = getLobby(game);
  lobby.playerReadyStatus[player.playerName] = isReady;
}
