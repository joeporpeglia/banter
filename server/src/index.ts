import io from 'socket.io';
import {
  ActionTypes,
  Games,
  JoinGame,
  GameAction,
  PlayerViews,
  AddPrompt,
} from '@banter/game';
const port = process.env.PORT || 8080;
const ioServer = io(port);

// Player connects to the server.
ioServer.on('connection', (playerSocket) => {
  // Player joins a game.
  playerSocket.on(ActionTypes.JoinGame, (joinGame: JoinGame) => {
    const { gameId, player } = joinGame;

    // Add player to the game "room" (namespaced dispatch channel).
    // See dispatcher below.
    playerSocket.join(gameId);

    const dispatcher = {
      all(action: GameAction) {
        ioServer.to(gameId).emit(action.type, action);
      },
      player(action: GameAction) {
        playerSocket.emit(action.type, action);
      },
      others(action: GameAction) {
        playerSocket.broadcast.to(gameId).emit(action.type, action);
      },
    };

    // Initialize the game and add the player.
    const game = Games.getOrCreate(gameId);
    Games.addPlayer(game, player);

    // Notify clients.
    dispatcher.player({
      type: ActionTypes.LoadGame,
      view: PlayerViews.viewForPlayer(game, player),
    });
    dispatcher.others({
      type: ActionTypes.PlayerJoined,
      player,
    });

    // Wait for prompts.
    playerSocket.on(ActionTypes.AddPrompt, (action: AddPrompt) => {
      Games.addPrompt(game, action.prompt);
      dispatcher.others({
        type: ActionTypes.PromptAdded,
      });
    });

    // Wait for player disconnect.
    playerSocket.on('disconnect', () => {
      Games.removePlayer(game, player);
      dispatcher.others({
        type: ActionTypes.PlayerLeft,
        player,
      });
    });
  });
});
