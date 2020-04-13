import { Reducer, useReducer, useEffect, useMemo } from 'react';
import io from 'socket.io-client';

export type Connecting = {
  type: 'Connecting';
};

export type ActivePlayerTurn = {
  type: 'ActivePlayerTurn';
};

export type OtherPlayerTurn = {
  type: 'OtherPlayerTurn';
};

export type GameState = Connecting | ActivePlayerTurn | OtherPlayerTurn;

export type GameLoad = {
  type: 'GameLoad';
  serverState: GameState;
};

export type GameAction = GameLoad | { type: 'none' };

const initialGameState: GameState = { type: 'Connecting' };
const BACKEND_HOST = 'localhost:8080';

function assertNever(_: never): never {
  throw new Error();
}

export function useGame(id: string) {
  const [state, dispatch] = useBackendReducer(
    BACKEND_HOST,
    id,
    (prevState: GameState, action: GameAction): GameState => {
      switch (action.type) {
        case 'GameLoad':
          return action.serverState;
        case 'none':
          return prevState;

        default:
          return assertNever(action);
      }
    },
    initialGameState,
  );

  return [state, dispatch] as const;
}

function useBackendReducer<S, A>(
  backendHost: string,
  namespace: string,
  reducer: Reducer<S, A>,
  initialState: S,
) {
  const socket = useMemo(() => io<A>(backendHost), [backendHost]);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    socket.emit('namespace', namespace);
    socket.on(namespace, dispatch);
    return () => {
      socket.close();
    };
  }, [namespace, socket]);

  const dispatchWithBackend = useMemo(
    () => (action: A) => {
      socket.emit(namespace, action);
      dispatch(action);
    },
    [namespace, socket],
  );

  return [state, dispatchWithBackend] as const;
}
