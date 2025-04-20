import { Injectable } from '@nestjs/common';
import { GameManager } from './game-manager';

@Injectable()
export class EngineService {
  private games = new Map<string, GameManager>();

  createGame(code: string) {
    const manager = new GameManager(code);
    this.games.set(code, manager);
  }

  getGame(code: string): GameManager | undefined {
    return this.games.get(code);
  }

  removeGame(code: string) {
    this.games.delete(code);
  }
}
