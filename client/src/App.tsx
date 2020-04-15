import React, {
  Suspense,
  PropsWithChildren,
  useMemo,
  ChangeEvent,
  useState,
} from 'react';
import {
  CSSReset,
  Heading,
  Spinner,
  Stack,
  Button,
  ThemeProvider,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
  Textarea,
} from '@chakra-ui/core';
import {
  BrowserRouter,
  Route,
  Link as RouterLink,
  RouteComponentProps,
} from 'react-router-dom';
import { useGame } from './Game';
import { ActionTypes, Player } from '@banter/game';

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

function generateGameId() {
  let gameId = '';

  while (gameId.length < 4) {
    gameId += ((Math.random() * 16) | 0).toString(16);
  }

  return gameId;
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

function GamePage(props: RouteComponentProps<{ gameId: string }>) {
  const { gameId } = props.match.params;
  const player: Player = useMemo(
    () => ({
      playerName: String(Math.random() * 10000),
    }),
    [],
  );

  const [game, dispatch] = useGame();

  if (!game.players.some((p) => p.playerName === player.playerName)) {
    dispatch({
      type: ActionTypes.JoinGame,
      gameId,
      player,
    });
  }

  const [promptText, setPromptText] = useState('');

  return (
    <>
      <h1>{game.status}</h1>
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
              type: ActionTypes.AddPrompt,
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
    </>
  );
}

function PageWrapper(props: PropsWithChildren<{}>) {
  return (
    <Stack spacing="8" p="12">
      <Breadcrumb separator={<Icon name="chevron-right" />}>
        <BreadcrumbItem>
          <RouterLink to="/">
            <BreadcrumbLink as="span">Home</BreadcrumbLink>
          </RouterLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {props.children}
    </Stack>
  );
}

export default App;
