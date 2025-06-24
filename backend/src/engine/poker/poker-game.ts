import { gamePlayer } from '../utils/game-types';
import { PokerRound } from './logic/poker-round';
import { PokerGameAction, PokerGameState, PokerPlayer } from './poker-types';

export class PokerGame {
  private players: PokerPlayer[];
  private state: PokerGameState;
  private currentRound: PokerRound | null;

  initialize() {
    this.players = [];
    this.state = {
      roundNumber: 0,
      gameOver: false,
      roundHistory: [],
      defaultBlindAmount: 10,
      currentRound: null,
      lastWinners: null,
      chipsInPlay: 0,
      // gameStarted: false,
      gameActive: false,
    } as PokerGameState;
  }

  addPlayer(player: gamePlayer): void {
    this.players.push({
      ...player,
      chips: 100, //TODO is that correct value
      hand: [],
      bet: 0,
      isAllIn: false,
      isFolded: false,
      isActive: true,
      ready: false,
    });
  }

  setPlayerReady(playerId: number): number | null {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) return null;
    player.ready = true;
    return this.players.filter((p) => p.ready).length;
  }

  disconnectPlayer(playerId: number): number | null {
    const player = this.players.find((p) => p.id === playerId);
    if (!player) return null;
    player.ready = false;
    this.state.gameActive = false;
    return this.players.filter((p) => p.ready).length;
  }

  removePlayer(playerId: number) {
    this.players.splice(this.getPlayerIdx(playerId), 1);
  }

  startGame() {
    this.state.roundNumber = 1;
    this.state.roundHistory = [];
    // this.state.gameStarted = true;
    this.state.gameActive = true;
    this.currentRound = new PokerRound({
      players: this.players,
      bigBlindAmount: this.state.defaultBlindAmount,
      roundNumber: 1,
      dealerIndex: 0,
      leftoverPot: 0,
    });

    // TODO: needed if game was manually started without all players ready
    this.players.forEach((p) => {
      p.ready = true;
    });

    this.newRound();
  }

  resumeGame() {
    this.state.gameActive = true;
  }

  newRound() {
    // filter out players who can't pay the blinds
    // this.state.players = this.state.players.filter(
    //   (player) => player.chips < this.state.defaultBlindAmount,
    // );
    this.state.gameOver = false;
    this.state.chipsInPlay = this.players.reduce(
      (acc, player) => acc + player.chips,
      0,
    );
    this.players.forEach((player) => {
      player.isFolded = false;
      player.isAllIn = false;
      player.isActive = true;
      player.hand = [];
      player.bet = 0;
    });
    if (this.currentRound) {
      this.state.roundHistory.push(this.currentRound.getState());
      this.state.lastWinners =
        this.state.roundHistory[this.state.roundHistory.length - 1].winners;
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

    this.currentRound.startRound();
  }

  processAction(playerId: number, action: string, payload?: any): void {
    if (this.state.gameOver) {
      throw new Error('Game is over');
    }
    if (!this.state.gameActive) {
      throw new Error('Game is not active');
    }
    if (!this.currentRound) {
      throw new Error('No current round to process action');
    }
    if (this.currentRound.getState().currentPlayerIndex !== playerId) {
      throw new Error(
        `It's not your turn ${this.currentRound.getState().currentPlayerIndex} ${playerId}`,
      );
    }
    
    const state = this.currentRound.processAction(
      playerId,
      action as PokerGameAction,
      payload,
    );

    if (state.gameOver) {
      this.state.gameOver = true;
      this.state.chipsInPlay = state.pot;
    }
  }

  getPlayerCount() {
    return this.players.length;
  }

  getState() {
    return {
      game: { ...this.state, players: this.players },
      round: this.currentRound?.getState(),
    };
  }

  getPlayerIdx(playerId: number) {
    return this.players.findIndex((p) => p.id === playerId);
  }
}
