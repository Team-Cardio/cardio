import { PokerGame } from './poker/poker-game';
import { gamePlayer, gameType } from './utils/game-types';

export class GameManager {
  private games: Map<string, PokerGame> = new Map();

  createGame(roomCode: string, type: gameType) {
    let engine: PokerGame;

    switch (type) {
      case 'poker':
        engine = new PokerGame();
        break;
      default:
        throw Error("Game not recognized")
      // Add more game types here
    }

    engine.initialize()
    this.games.set(roomCode, engine);
    console.log("add game")
  }

  getGame(roomCode: string): PokerGame | undefined {
    return this.games.get(roomCode);
  }

  removeGame(roomCode: string) {
    this.games.delete(roomCode);
  }
}
