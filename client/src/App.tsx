import React, { Suspense, PropsWithChildren, useRef, useMemo } from 'react';
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
  Input,
} from '@chakra-ui/core';
import {
  BrowserRouter,
  Route,
  Link as RouterLink,
  RouteComponentProps,
} from 'react-router-dom';
import { useGame } from './Game';

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

  const [gameState, gameDispatch] = useGame(gameId);

  return <h1>{gameState.type}</h1>;
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
