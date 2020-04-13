import { Player, PlayerView, LobbyView, Prompt } from '@banter/api';

export type Lobby = {
  status: 'Lobby';
  players: Player[];
  prompts: Prompt[];
};

export type PlayerTurn = {
  status: 'PlayerTurn';
};

export type Review = {
  status: 'Review';
};

export type Game = Lobby | PlayerTurn | Review;

const games: Record<string, Game> = {};

export function getOrCreate(id: string): Game {
  if (!games[id]) {
    games[id] = {
      status: 'Lobby',
      players: [],
      prompts: [],
    };
  }

  return games[id];
}

export function viewForPlayer(game: Game, player: Player): PlayerView {
  switch (game.status) {
    case 'Lobby':
      return viewLobby(game, player);

    case 'PlayerTurn':
    case 'Review':
      return {
        status: 'Lobby',
        players: [],
        numberOfPrompts: 0,
      };
  }
}

export function addPlayer(game: Game, player: Player): void {
  getLobby(game).players.push(player);
}

export function removePlayer(game: Game, player: Player): void {
  const lobby = getLobby(game);
  lobby.players = lobby.players.filter((p) => p !== player);
}

export function addPrompt(game: Game, prompt: Prompt): void {
  const lobby = getLobby(game);
  lobby.prompts.push(prompt);
}

export function removePrompt(game: Game, promptId: string): void {
  const lobby = getLobby(game);
  lobby.prompts = lobby.prompts.filter((p) => p.promptId !== promptId);
}

function getLobby(game: Game): Lobby {
  if (game.status !== 'Lobby') {
    throw new Error();
  }

  return game;
}

function viewLobby(game: Game, player: Player): Readonly<LobbyView> {
  const lobby = getLobby(game);
  return {
    status: 'Lobby',
    players: lobby.players,
    numberOfPrompts: lobby.prompts.length,
  };
}
