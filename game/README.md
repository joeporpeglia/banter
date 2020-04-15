# `@banter/game`

Game logic for the Banter game API.

## Notes:

- `src/Game.ts` defines the server-side state machine for the game. This includes functions to apply game constraints while reading and **mutating** game objects.Doesn't rely on value comparisons so we can avoid the memory costs of immutability.
- `src/PlayerView` defines the client-side state machine for the game. This module defines functions to operate on **immutable** `PlayerView` objects.
- `src/GameAction.ts` defines all the actions between players and the game.
