import { Injectable } from '@nestjs/common';
import { GameManager } from './game-manager';
import { gameType } from './utils/game-types';
import { PokerGame } from './poker/poker-game';

@Injectable()
export class EngineService {
  private gameManager: GameManager;
  constructor() {
    this.gameManager = new GameManager();
  }

  createGame(code: string, type: gameType) {
    this.gameManager.createGame(code, type)
  }

  getGame(code: string): PokerGame | undefined {
    return this.gameManager.getGame(code)
  }

  removeGame(code: string) {
    this.gameManager.removeGame(code);
  }
}
