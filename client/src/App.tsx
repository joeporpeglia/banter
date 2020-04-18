import {
  GameAction,
  GameActions,
  GameEvents,
  Player,
  updatePlayerView,
  LobbyView,
} from '@banter/game';
import {
  Box,
  Button,
  CSSReset,
  Heading,
  Spinner,
  Stack,
  Textarea,
  ThemeProvider,
} from '@chakra-ui/core';
import React, {
  ChangeEvent,
  PropsWithChildren,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  BrowserRouter,
  Link as RouterLink,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import io from 'socket.io-client';

function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/game/:gameId" exact component={GamePage} />
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function HomePage() {
  const newGameId = useMemo(generateGameId, []);

  return (
    <PageWrapper>
      <Heading size="2xl">Banter</Heading>
      <Box>
        <RouterLink to={`/game/${newGameId}`}>
          <Button
            as="span"
            variantColor="green"
            rightIcon="arrow-forward"
            size="lg"
          >
            Start a new game
          </Button>
        </RouterLink>
      </Box>
    </PageWrapper>
  );
}

function generateGameId() {
  let gameId = '';

  while (gameId.length < 4) {
    gameId += ((Math.random() * 16) | 0).toString(16);
  }

  return gameId;
}

function GamePage(props: RouteComponentProps<{ gameId: string }>) {
  const { gameId } = props.match.params;
  const player: Player = useMemo(
    () => ({
      playerName: String(Math.random() * 10000),
    }),
    [],
  );

  const [game, dispatch] = useGame(gameId, player);
  const [promptText, setPromptText] = useState('');
  const isReady = game.playerReadyStatus[player.playerName] ?? false;

  return (
    <PageWrapper>
      <pre>
        <code>{JSON.stringify(game, null, 2)}</code>
      </pre>
      <Stack>
        <Textarea
          value={promptText}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPromptText(e.target.value)
          }
        />
        <Button
          onClick={() => {
            dispatch({
              type: GameActions.AddPrompt,
              prompt: {
                promptId: String(Math.random()),
                text: promptText,
              },
            });
            setPromptText('');
          }}
        >
          Add prompt
        </Button>
        {isReady ? (
          <Button
            variant="outline"
            variantColor="red"
            onClick={() =>
              dispatch({
                type: GameActions.SetReady,
                isReady: false,
              })
            }
          >
            Unready
          </Button>
        ) : (
          <Button
            variant="outline"
            variantColor="green"
            onClick={() =>
              dispatch({
                type: GameActions.SetReady,
                isReady: true,
              })
            }
          >
            Ready
          </Button>
        )}
      </Stack>
    </PageWrapper>
  );
}

const BACKEND_HOST = 'localhost:8080';

export function useGame(gameId: string, player: Player) {
  const [playerView, dispatch] = useReducer(updatePlayerView, {
    status: 'Lobby',
    activePlayerName: '',
    players: [player],
    numberOfPrompts: 0,
    playerReadyStatus: {},
  } as LobbyView);

  const socket = useMemo(() => io(BACKEND_HOST), []);
  const dispatchWithServer = useMemo(
    () => (action: GameAction) => {
      socket.emit(action.type, action);
      dispatch(action);
    },
    [socket],
  );
  useEffect(() => {
    Object.keys(GameEvents).forEach((type) => socket.on(type, dispatch));
    return () => {
      socket.close();
    };
  }, [socket]);
  useEffect(() => {
    dispatchWithServer({
      type: GameActions.JoinGame,
      player,
      gameId,
    });

    // TODO dispatch leave game action in effect cleanup
  }, [dispatchWithServer, gameId, player]);

  return [playerView, dispatchWithServer] as const;
}

function PageWrapper(props: PropsWithChildren<{}>) {
  return (
    <Stack spacing="8" p="12">
      {props.children}
    </Stack>
  );
}

export default App;
