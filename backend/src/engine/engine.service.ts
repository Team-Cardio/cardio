import { Injectable } from '@nestjs/common';
import { GameManager } from './game-manager';
import { GameEngine } from './game-engine.interface';
import { gameType } from './utils/game-types';

@Injectable()
export class EngineService {
  private gameManager: GameManager;
  constructor() {
    this.gameManager = new GameManager();
  }

  createGame(code: string, type: gameType) {
    this.gameManager.createGame(code, type)
  }

  getGame(code: string): GameEngine | undefined {
    return this.gameManager.getGame(code)
  }

  removeGame(code: string) {
    this.gameManager.removeGame(code);
  }
}
