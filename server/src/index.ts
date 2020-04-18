import { createSession, GameActions, JoinGame } from '@banter/game';
import io from 'socket.io';

const port = process.env.PORT || 8080;
const ioServer = io(port);

// Player connects to the server.
ioServer.on('connection', (playerSocket) => {
  // Player joins a game.
  playerSocket.on(GameActions.JoinGame, (joinGame: JoinGame) => {
    const { gameId } = joinGame;

    // Add player to the game "room" (namespaced dispatch channel).
    // See dispatcher below.
    playerSocket.join(gameId);

    const session = createSession(joinGame, {
      all(action) {
        ioServer.to(gameId).emit(action.type, action);
      },
      player(action) {
        playerSocket.emit(action.type, action);
      },
      others(action) {
        playerSocket.broadcast.to(gameId).emit(action.type, action);
      },
    });

    Object.keys(GameActions).forEach((actionType) =>
      playerSocket.on(actionType, session.handleAction),
    );

    // Wait for player disconnect.
    playerSocket.on('disconnect', () => {
      session.close();
    });
  });
});
