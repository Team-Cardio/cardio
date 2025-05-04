import { Card } from 'src/types/card';
import { Color, Rank } from 'src/types/enums/card.enum';
import {
  InitialRoundState,
  PokerGameAction,
  PokerGameState,
  PokerPlayer,
  PokerRoundState,
} from '../poker-types';

import { PokerHandCompare } from './poker-hand-compare';

export class PokerRound {
  private players: PokerPlayer[];
  private state: PokerRoundState;

  constructor(initialState: InitialRoundState) {
    this.players = initialState.players;
    this.initializeRound(initialState);
  }

  // Initialize the round
  initializeRound(initialState: InitialRoundState) {
    this.state.currentBet = 0;
    this.state.pot = 0;
    this.state.communityCards = [];
    this.state.currentRound = initialState.roundNumber;
    this.state.blindAmount = initialState.blindAmount;
    this.state.deck = this.shuffleDeck(this.createDeck());
    this.dealCards();
    this.state.blindPlayerIndex =
      (this.state.blindPlayerIndex + 1) % this.players.length;
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
    this.state.numberOfPlayersToPlay -= 1;
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
    this.state.numberOfPlayersToPlay -= 1;
    // important to add later: cap on the reward for the player who is all in to the amount of chips they had before going all in
  }

  nextPlayer() {
    if (this.state.gameOver || this.state.numberOfPlayersToPlay <= 1) {
      this.state.gameOver = true;
      return;
    }
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

  dealCards() {
    for (const player of this.state.players) {
      if (!player.isFolded) {
        player.hand.push(this.state.deck.pop()!);
        player.hand.push(this.state.deck.pop()!);
      }
    }
  }

  dealFlop() {
    this.state.communityCards.push(this.state.deck.pop()!);
  }

  dealTurn() {
    this.state.communityCards.push(this.state.deck.pop()!);
  }

  dealCommunityCards() {
    this.dealFlop();
    this.dealTurn();
  }

  chooseWinner() {
    const remainingPlayers = this.state.players.filter(
      (player) => !player.isFolded,
    );
    if (remainingPlayers.length === 0) {
      this.state.winner = null;
      return;
    }
    let bestHand = remainingPlayers[0];
    for (let i = 1; i < remainingPlayers.length; i++) {
      const currentPlayer = remainingPlayers[i];
      const comparison = PokerHandCompare.compareHands(
        bestHand.hand,
        this.state.communityCards,
        currentPlayer.hand,
      );
      if (comparison > 0) {
        bestHand = currentPlayer;
      }
    }
    this.state.winner = bestHand;
  }

  updateChips() {
    if (this.state.winner) {
      this.state.winner.chips += this.state.pot;
      this.state.pot = 0;
    }
  }
}
