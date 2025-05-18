import { type PokerRoundState, type PokerGameState } from './poker/poker-types';
import { gamePlayer } from './utils/game-types';

export interface GameEngine {
  initialize(): void;
  addPlayer(player: gamePlayer): void;
  startGame(): void;
  newRound(): void;
  processAction(playerId: number, action: string, payload?: any): void;
  getState(): {game: PokerGameState, round: PokerRoundState|undefined};
  getPlayerIdx(playerId: number): number|undefined
}
