import { GameEngine } from './game-engine.interface';
import { PokerGame } from './poker/poker-game';
import { gamePlayer, gameType } from './utils/game-types';

export class GameManager {
  private games: Map<string, GameEngine> = new Map();

  createGame(roomCode: string, type: gameType) {
    let engine: GameEngine;

    switch (type) {
      case 'poker':
        engine = new PokerGame();
        break;
      default:
        throw Error("Game not recognized")
      // Add more game types here
    }

    engine.initialize();
    this.games.set(roomCode, engine);
  }

  getGame(roomCode: string): GameEngine | undefined {
    return this.games.get(roomCode);
  }

  removeGame(roomCode: string) {
    this.games.delete(roomCode);
  }
}
