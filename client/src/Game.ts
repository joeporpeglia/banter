import { useReducer, useEffect, useMemo, Dispatch } from 'react';
import io, { Socket } from 'socket.io-client';
import { updatePlayerView, ActionTypes } from '@banter/game';

const BACKEND_HOST = 'localhost:8080';

export function useGame() {
  const [playerView, dispatch] = useReducer(updatePlayerView, {
    status: 'Lobby',
    players: [],
    numberOfPrompts: 0,
  });

  const socket = useMemo(() => io(BACKEND_HOST), []);
  const backendDispatch = useBackendDispatch(dispatch, socket);
  useEffect(() => {
    Object.keys(ActionTypes).forEach((type) => socket.on(type, dispatch));
    return () => socket.close();
  }, [socket]);

  return [playerView, backendDispatch] as const;
}

function useBackendDispatch<A extends { type: string }>(
  dispatch: Dispatch<A>,
  socket: Socket,
): Dispatch<A> {
  return useMemo(
    () => (action: A) => {
      socket.emit(action.type, action);
      dispatch(action);
    },
    [dispatch, socket],
  );
}
