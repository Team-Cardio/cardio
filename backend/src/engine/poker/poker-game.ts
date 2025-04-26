import { Card } from 'src/types/card';
import { Color, Rank } from 'src/types/enums/card.enum';
import { GameEngine } from '../game-engine.interface';
import { gamePlayer } from '../utils/game-types';
import { PokerGameAction, PokerGameState, PokerPlayer } from './poker-types';

export class PokerGame implements GameEngine {
  private players: PokerPlayer[] = [];
  private state: PokerGameState = {
    players: [],
    pot: 0,
    communityCards: [],
    currentBet: 0,
    currentPlayerIndex: 0,
    round: 0,
    gameOver: false,
    winner: null,
    deck: [],
  };

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
      pot: 0,
      communityCards: [],
      currentBet: 0,
      currentPlayerIndex: 0,
      round: 0,
      gameOver: false,
      winner: null,
      deck: this.createDeck(),
    };
  }

  shuffleDeck(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      // Fisher-Yates shuffle algorithm xD
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  createDeck() {
    const deck: Card[] = [];
    for (const color of Object.values(Color)) {
      for (const rank of Object.values(Rank)) {
        deck.push({ color: color as Color, rank: rank as Rank });
      }
    }
    return this.shuffleDeck(deck);
  }

  processAction(playerId: number, action: PokerGameAction, payload?: any) {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    switch (action) {
      case 'bet':
        this.handleBet(player, payload.amount);
        break;
      case 'call':
        this.handleCall(player);
        break;
      case 'raise':
        this.handleRaise(player, payload.amount);
        break;
      case 'fold':
        this.handleFold(player);
        break;
      case 'check':
        this.handleCheck(player);
        break;
      case 'allIn':
        this.handleAllIn(player);
        break;
      default:
        throw new Error('Invalid action');
    }
    this.nextPlayer();
    return this.getState();
  }

  handleBet(player: PokerPlayer, amount: number) {
    if (amount < this.state.currentBet) {
      throw new Error('Bet must be at least the current bet');
    }
    if (player.chips < amount) {
      throw new Error('Not enough chips');
    }
    player.chips -= amount;
    player.bet += amount;
    this.state.pot += amount;
    this.state.currentBet = amount;
  }

  handleCall(player: PokerPlayer) {
    const amountToCall = this.state.currentBet - player.bet;
    if (amountToCall > player.chips) {
      throw new Error('Not enough chips to call');
    }
    player.chips -= amountToCall;
    player.bet += amountToCall;
    this.state.pot += amountToCall;
  }

  handleRaise(player: PokerPlayer, amount: number) {
    if (amount < this.state.currentBet) {
      throw new Error('Raise must be at least the current bet');
    }
    if (player.chips < amount) {
      throw new Error('Not enough chips');
    }
    player.chips -= amount;
    player.bet += amount;
    this.state.pot += amount;
    this.state.currentBet = amount;
  }

  handleFold(player: PokerPlayer) {
    player.isFolded = true;
  }

  handleCheck(player: PokerPlayer) {
    if (this.state.currentBet > player.bet) {
      throw new Error('Cannot check, there is a bet to call');
    }
  }
  handleAllIn(player: PokerPlayer) {
    if (player.chips === 0) {
      throw new Error('Player is already all in');
    }
    this.state.pot += player.chips;
    player.bet += player.chips;
    player.isAllIn = true;
    player.chips = 0;
    // important to add later: cap on the reward for the player who is all in to the amount of chips they had before going all in
  }

  nextPlayer() {
    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + 1) % this.state.players.length;
    const currentPlayer = this.state.players[this.state.currentPlayerIndex];
    if (currentPlayer.isFolded || currentPlayer.isAllIn) {
      this.nextPlayer();
    }
  }

  getState() {
    return this.state;
  }
}
