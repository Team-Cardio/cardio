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
      chips: 100, //TODO is that correct value
      hand: [],
      bet: 0,
      isAllIn: false,
      isFolded: false,
      isActive: true,
    }));
    this.state = {
      players: this.players,
      roundNumber: 0,
      gameOver: false,
      roundHistory: [],
      defaultBlindAmount: 10,
      currentRound: null,
      lastWinner: null,
      chipsInPlay: 0,
    } as PokerGameState;
  }

  startGame() {
    this.state.roundNumber = 1;
    this.state.roundHistory = [];
    this.currentRound = new PokerRound({
      players: this.players,
      bigBlindAmount: this.state.defaultBlindAmount,
      roundNumber: 1,
      dealerIndex: 0,
      leftoverPot: 0,
    });
  }

  newRound() {
    if (this.currentRound) {
      this.state.roundHistory.push(this.currentRound.getState());
      this.state.lastWinner =
        this.state.roundHistory[this.state.roundHistory.length - 1].winner;
      this.state.roundNumber++;
      this.currentRound = new PokerRound({
        players: this.players,
        bigBlindAmount: this.state.defaultBlindAmount,
        roundNumber: this.state.roundNumber,
        dealerIndex:
          (this.state.roundHistory[this.state.roundHistory.length - 1]
            .dealerIndex +
            1) %
          this.players.length,
        leftoverPot: this.state.chipsInPlay,
      });
    } else {
      throw new Error('No current round to end');
    }
  }

  endGame() {
    this.state.gameOver = true;
  }

  processAction(playerId: number, action: string, payload?: any): void {
    if (action === 'start') {
      this.startGame();
      return;
    }
    if (action === 'end_game') {
      this.endGame();
      return;
    }
    if (action === 'new_round') {
      this.newRound();
      return;
    }
    if (!this.currentRound) {
      throw new Error('No current round to process action');
    }
    if (this.currentRound.getState().currentPlayerIndex !== playerId) {
      throw new Error(`It's not your turn`);
    }
    this.currentRound?.processAction(
      playerId,
      action as PokerGameAction,
      payload,
    );

    if (this.currentRound?.getState().gameOver) {
      this.state.players = this.currentRound.getState().players;
      this.state.chipsInPlay = this.currentRound.getState().pot;
    }
  }

  getState(): PokerGameState {
    return this.state;
  }
}
