# `@banter/server`

TypeScript Socket.io Server for Banter.

## Notes:

- Handles websockets for `@banter/client`.
- `src/Game.ts` defines the server-side state machine for the game. This includes functions to apply game constraints while reading and **mutating** game objects.
- Doesn't rely on value comparisons so we can avoid the memory costs of immutability.
