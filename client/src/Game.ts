import { useReducer, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import { PlayerViews, ActionTypes, GameAction } from '@banter/game';

const BACKEND_HOST = 'localhost:8080';

export function useGame() {
  const [playerView, dispatch] = useReducer(PlayerViews.updateView, {
    status: 'Lobby',
    players: [],
    numberOfPrompts: 0,
  });

  const socket = useMemo(() => io(BACKEND_HOST), []);
  const dispatchWithServer = useMemo(
    () => (action: GameAction) => {
      socket.emit(action.type, action);
      dispatch(action);
    },
    [dispatch, socket],
  );
  useEffect(() => {
    Object.keys(ActionTypes).forEach((type) => socket.on(type, dispatch));
    return () => socket.close();
  }, [socket]);

  return [playerView, dispatchWithServer] as const;
}
