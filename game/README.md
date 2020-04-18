# `@banter/game`

Core game types and state machines.

## Notes:

- `src/Game.ts` defines the game interface.
- `src/GameServer.ts` defines the server-side state machine. This module defines functions to operate on **mutable** `Game` objects.
- `src/GameClient.ts` defines the client-side state machine. This module defines functions to operate on **immutable** `PlayerView` objects.
