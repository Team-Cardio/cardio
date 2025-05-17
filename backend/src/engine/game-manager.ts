import { GameEngine } from './game-engine.interface';
import { PokerGame } from './poker/poker-game';
import { gameType } from './utils/game-types';

export class GameManager {
  private games: Map<string, GameEngine> = new Map();
  private roomCode: string;

  constructor(code: string) {
    this.roomCode = code;
  }

  createGame(roomCode: string, type: gameType, players: any[]) {
    let engine: GameEngine;

    switch (type) {
      case 'poker':
        engine = new PokerGame();
        break;
      // Add more game types here
    }

    engine.initialize(players);
    this.games.set(roomCode, engine);
  }

  getGame(roomCode: string): GameEngine | undefined {
    return this.games.get(roomCode);
  }

  removeGame(roomCode: string) {
    this.games.delete(roomCode);
  }
}
