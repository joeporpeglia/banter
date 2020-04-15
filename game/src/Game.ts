import { Player } from './Player';

export type Prompt = {
  promptId: string;
  text: string;
};

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

export const Games = {
  getOrCreate(id: string): Game {
    if (!games[id]) {
      games[id] = {
        status: 'Lobby',
        players: [],
        prompts: [],
      };
    }

    return games[id];
  },

  getLobby(game: Game): Lobby {
    if (game.status !== 'Lobby') {
      throw new Error();
    }

    return game;
  },

  addPlayer(game: Game, player: Player): void {
    Games.getLobby(game).players.push(player);
  },

  removePlayer(game: Game, player: Player): void {
    const lobby = Games.getLobby(game);
    lobby.players = lobby.players.filter((p) => p !== player);
  },

  addPrompt(game: Game, prompt: Prompt): void {
    const lobby = Games.getLobby(game);
    lobby.prompts.push(prompt);
  },

  removePrompt(game: Game, promptId: string): void {
    const lobby = Games.getLobby(game);
    lobby.prompts = lobby.prompts.filter((p) => p.promptId !== promptId);
  },
};
