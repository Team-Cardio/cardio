import { Card, Color, Rank } from 'src/types/card';

import {
  InitialRoundState,
  PokerGameAction,
  PokerRoundStateEnum,
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

  initializeRound(initialState: InitialRoundState) {
    this.state = {
      roundPhase: PokerRoundStateEnum.PreFlop,
      players: this.players,
      pot: 0,
      communityCards: [],
      currentBet: 0,
      currentPlayerIndex: initialState.dealerIndex,
      currentRound: initialState.roundNumber,
      gameOver: false,
      winner: null,
      deck: this.shuffleDeck(this.createDeck()),
      numberOfPlayersToPlay: initialState.players.length,
      numberOfActivePlayers: initialState.players.length,
      dealerIndex: initialState.dealerIndex,
      bigBlindAmount: initialState.bigBlindAmount,
      smallBlindAmount: initialState.bigBlindAmount / 2,
      minimumBet: initialState.bigBlindAmount,
    } as PokerRoundState;
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

  startRound() {
    const dealer = this.state.players[this.state.dealerIndex];
    const smallBlind =
      this.state.players[
        (this.state.dealerIndex + 1) % this.state.players.length
      ];
    const bigBlind =
      this.state.players[
        (this.state.dealerIndex + 2) % this.state.players.length
      ];
    smallBlind.chips -= this.state.smallBlindAmount;
    smallBlind.bet += this.state.smallBlindAmount;
    bigBlind.chips -= this.state.bigBlindAmount;
    bigBlind.bet += this.state.bigBlindAmount;
    this.state.pot += this.state.smallBlindAmount + this.state.bigBlindAmount;
    this.state.currentBet = this.state.bigBlindAmount;
    this.state.currentPlayerIndex =
      (this.state.dealerIndex + 3) % this.state.players.length;

    this.dealCards();
  }

  processAction(playerId: number, action: PokerGameAction, payload?: any) {
    const player = this.state.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    if (this.state.currentPlayerIndex !== playerId) {
      throw new Error('Not your turn');
    }
    if (player.isFolded || player.isAllIn) {
      throw new Error('Player cannot take action');
    }
    if (this.state.gameOver) {
      throw new Error('Game is over');
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
    if (this.state.numberOfPlayersToPlay === 1) {
      this.state.gameOver = true;
      this.state.winner = this.state.players.find((p) => !p.isFolded) || null;
      this.updateChips();
      return this.getState();
    }

    if (this.state.numberOfActivePlayers === 0) {
      if (this.state.roundPhase === PokerRoundStateEnum.PreFlop) {
        this.state.roundPhase = PokerRoundStateEnum.Flop;
        this.dealFlop();
      }
      if (this.state.roundPhase === PokerRoundStateEnum.Flop) {
        this.state.roundPhase = PokerRoundStateEnum.Turn;
        this.dealTurn();
      }
      if (this.state.roundPhase === PokerRoundStateEnum.Turn) {
        this.state.roundPhase = PokerRoundStateEnum.River;
        this.dealRiver();
      }
      if (this.state.roundPhase === PokerRoundStateEnum.River) {
        this.state.gameOver = true;
        this.chooseWinner();
        this.updateChips();
        return this.getState();
      }
      for (const player of this.state.players) {
        if (player.isFolded) {
          player.isActive = false;
        } else {
          player.isActive = true;
        }
      }
      this.state.numberOfActivePlayers = this.state.players.length;
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
    player.isActive = false;
    this.state.numberOfPlayersToPlay -= 1;
  }

  handleCheck(player: PokerPlayer) {
    if (this.state.currentBet > player.bet) {
      throw new Error('Cannot check, there is a bet to call');
    }
    if (player.isActive) this.state.numberOfActivePlayers -= 1;
    player.isActive = false;
  }

  handleAllIn(player: PokerPlayer) {
    if (player.isAllIn) {
      throw new Error('Player is already all in');
    }
    if (player.chips === 0) {
      throw new Error('Player has no chips to go all in');
    }
    this.state.pot += player.chips;
    player.bet += player.chips;
    player.isAllIn = true;
    player.isActive = false;
    this.state.numberOfActivePlayers -= 1;
    player.chips = 0;
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

  dealCommunityCard() {
    this.state.communityCards.push(this.state.deck.pop()!);
  }

  dealFlop() {
    for (let i = 0; i < 3; i++) {
      this.dealCommunityCard();
    }
  }

  dealTurn() {
    this.dealCommunityCard();
  }

  dealRiver() {
    this.dealCommunityCard();
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
