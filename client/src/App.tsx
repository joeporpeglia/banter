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
  Input,
  FormControl,
  FormLabel,
  Switch,
  Flex,
} from '@chakra-ui/core';
import React, {
  ChangeEvent,
  PropsWithChildren,
  Suspense,
  useEffect,
  useMemo,
  useReducer,
  useState,
  createContext,
} from 'react';
import { BrowserRouter, Link as RouterLink, Route } from 'react-router-dom';
import io from 'socket.io-client';

const PlayerContext = createContext<Player | null>(null);

function App() {
  const [player, setPlayer] = useState<Player | null>(null);

  return (
    <PlayerContext.Provider value={player}>
      <ThemeProvider>
        <CSSReset />
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            {player ? (
              <LoggedIn player={player} />
            ) : (
              <LoggedOut setPlayer={setPlayer} />
            )}
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </PlayerContext.Provider>
  );
}

type LoggedInProps = {
  player: Player;
};

function LoggedIn(props: LoggedInProps) {
  const { player } = props;

  return (
    <>
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route
        path="/game/:gameId"
        exact
        render={(route) => (
          <GamePage gameId={route.match.params.gameId} player={player} />
        )}
      />
    </>
  );
}

type LoggedOutProps = {
  setPlayer: (p: Player) => void;
};

function LoggedOut(props: LoggedOutProps) {
  const { setPlayer } = props;
  const [name, setName] = useState('');

  useEffect(() => {
    const savedPlayer: string | null = localStorage.getItem(
      '@banter/saved-player',
    );
    if (savedPlayer) {
      setPlayer(JSON.parse(savedPlayer));
    }
  }, [setPlayer]);

  function handleSave() {
    if (!name.trim().length) {
      return;
    }
    const player: Player = {
      playerName: name,
    };

    localStorage.setItem('@banter/saved-player', JSON.stringify(player));
    setPlayer({
      playerName: name,
    });
    setPlayer(player);
  }

  return (
    <PageWrapper>
      <Heading size="xl">Login</Heading>
      <FormControl>
        <FormLabel htmlFor="username">Username</FormLabel>
        <Input
          id="username"
          value={name}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value)
          }
        />
      </FormControl>
      <Button size="lg" variant="solid" onClick={handleSave}>
        Login
      </Button>
    </PageWrapper>
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

type GamePageProps = {
  gameId: string;
  player: Player;
};

function GamePage(props: GamePageProps) {
  const { player, gameId } = props;
  const [game, dispatch] = useGame(gameId, player);
  const [promptText, setPromptText] = useState('');
  const isReady = game.playerReadyStatus[player.playerName] ?? false;

  return (
    <PageWrapper>
      <Stack spacing={6}>
        <Box as="pre">
          <code>{JSON.stringify(game, null, 2)}</code>
        </Box>
        <Stack spacing={2}>
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
        </Stack>
        <Flex justify="flex-end">
          <FormLabel htmlFor="player-ready" fontSize="lg">
            Ready?
          </FormLabel>
          <Switch
            id="player-ready"
            size="lg"
            color="green"
            isChecked={isReady}
            onChange={() =>
              dispatch({
                type: GameActions.SetReady,
                isReady: !isReady,
              })
            }
          />
        </Flex>
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
