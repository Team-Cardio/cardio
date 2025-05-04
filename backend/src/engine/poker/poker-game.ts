import { Card } from 'src/types/card';
import { Color, Rank } from 'src/types/enums/card.enum';
import { GameEngine } from '../game-engine.interface';
import { gamePlayer } from '../utils/game-types';
import { PokerGameAction, PokerGameState, PokerPlayer } from './poker-types';
import { PokerRound } from './logic/poker-round';

export class PokerGame implements GameEngine {
  private players: PokerPlayer[];
  private state: PokerGameState;
  private currentRound: PokerRound | null;

  initialize(players: gamePlayer[]) {
    this.players = players.map((player) => ({
      ...player,
      chips: 1000,
      hand: [],
      bet: 0,
      isAllIn: false,
      isFolded: false,
    }));
    this.state = {
      players: this.players,
      roundNumber: 0,
      gameOver: false,
      roundHistory: [],
      defaultBlindAmount: 10,
      currentRound: null,
      lastWinner: null,
    } as PokerGameState;
  }

  startGame() {
    this.state.roundNumber = 1;
    this.state.roundHistory = [];
    this.currentRound = new PokerRound({
      players: this.players,
      blindAmount: this.state.defaultBlindAmount,
      roundNumber: 1,
    });
  }

  newRound() {
    if (this.currentRound) {
      this.state.roundHistory.push(this.currentRound.getState());
      this.state.lastWinner = this.currentRound.getState().winner;
      this.state.roundNumber++;
      this.currentRound = new PokerRound({
        players: this.players,
        blindAmount: this.state.defaultBlindAmount,
        roundNumber: this.state.roundNumber,
      });
    } else {
      throw new Error('No current round to end');
    }
  }

  processAction(playerId: number, action: string, payload?: any): void {
    this.currentRound?.processAction(
      playerId,
      action as PokerGameAction,
      payload,
    );

    if (this.currentRound?.getState().gameOver) {
      this.newRound();
    }
  }

  getState(): PokerGameState {
    return this.state;
  }
}
