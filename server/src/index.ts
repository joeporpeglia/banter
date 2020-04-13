import io from 'socket.io';
import { Actions, Player, Prompt, JoinGame } from '@banter/api';
import * as Game from './Game';

const port = process.env.PORT || 8080;
const ioServer = io(port);

// Player connects to the server.
ioServer.on('connection', (playerSocket) => {
  // Player joins a game.
  playerSocket.on(Actions.JoinGame, (joinGame: JoinGame) => {
    const { gameId, playerName } = joinGame;

    // Add player to the game "room" (namespaced dispatch channel).
    // See dispatcher below.
    playerSocket.join(gameId);

    const dispatcher = {
      all: ioServer.to(gameId),
      player: playerSocket,
      others: playerSocket.broadcast.to(gameId),
    };

    // Initialize the player and game.
    const player: Player = { playerName };
    const game = Game.getOrCreate(gameId);

    // Add player to game object.
    Game.addPlayer(game, player);

    // Notify clients.
    dispatcher.player.emit(Actions.LoadGame, Game.viewForPlayer(game, player));
    dispatcher.others.emit(Actions.PlayerJoined, player);

    // Wait for prompts.
    playerSocket.on(Actions.AddPrompt, (prompt: Prompt) => {
      Game.addPrompt(game, prompt);
    });

    // Wait for player disconnect.
    playerSocket.on('disconnect', () => {
      Game.removePlayer(game, player);
      dispatcher.others.emit(Actions.PlayerLeft, player);
    });
  });
});
