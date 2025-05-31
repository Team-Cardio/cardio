import { Card, Color, Rank } from 'src/types/card';

import {
  InitialRoundState,
  PokerGameAction,
  PokerPlayer,
  PokerRoundState,
  PokerRoundStateEnum,
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
      winners: null,
      deck: this.shuffleDeck(this.createDeck()),
      numberOfPlayersToPlay: initialState.players.length, // players that are in the game
      numberOfActivePlayers: initialState.players.length, // players since last raise
      dealerIndex: initialState.dealerIndex,
      bigBlindAmount: initialState.bigBlindAmount,
      smallBlindAmount: initialState.bigBlindAmount / 2,
      minimumBet: initialState.bigBlindAmount,
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

  startRound() {
    const { state } = this;
    const dealer = state.players[state.dealerIndex];
    const smallBlind =
      state.players[(state.dealerIndex + 1) % state.players.length];
    const bigBlind =
      state.players[(state.dealerIndex + 2) % state.players.length];
    smallBlind.chips -= state.smallBlindAmount;
    if (smallBlind.chips <= 0) {
      smallBlind.isAllIn = true;
      smallBlind.chips = 0;
    }
    if (bigBlind.chips <= 0) {
      bigBlind.isAllIn = true;
      bigBlind.chips = 0;
    }
    smallBlind.bet += state.smallBlindAmount;
    bigBlind.chips -= state.bigBlindAmount;
    bigBlind.bet += state.bigBlindAmount;
    state.pot += state.smallBlindAmount + state.bigBlindAmount;
    state.currentBet = state.bigBlindAmount;
    state.currentPlayerIndex = (state.dealerIndex + 3) % state.players.length;

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
    if (!player.isActive) {
      // covers all in and folded as well
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
      this.state.winners =
        this.state.players.filter((p) => !p.isFolded) || null;
      this.updateChips();
      return this.getState();
    }

    if (this.state.numberOfActivePlayers === 0) {
      if (this.state.roundPhase === PokerRoundStateEnum.PreFlop) {
        this.state.roundPhase = PokerRoundStateEnum.Flop;
        this.dealFlop();
      } else if (this.state.roundPhase === PokerRoundStateEnum.Flop) {
        this.state.roundPhase = PokerRoundStateEnum.Turn;
        this.dealTurn();
      } else if (this.state.roundPhase === PokerRoundStateEnum.Turn) {
        this.state.roundPhase = PokerRoundStateEnum.River;
        this.dealRiver();
      } else if (this.state.roundPhase === PokerRoundStateEnum.River) {
        this.state.gameOver = true;
        this.chooseWinners();
        this.updateChips();
        return this.getState(); // pot might not be empty, returns here
      }

      this.state.numberOfActivePlayers = this.state.numberOfPlayersToPlay;
      for (const player of this.state.players) {
        player.isActive = !player.isFolded;
      }
    }

    this.nextPlayer();
    return this.getState();
  }

  handleCall(player: PokerPlayer) {
    const amountToCall = this.state.currentBet - player.bet;
    if (amountToCall > player.chips) {
      throw new Error('Not enough chips to call');
    }
    if (amountToCall === player.chips) {
      this.handleAllIn(player);
      return;
    }

    player.chips -= amountToCall;
    player.bet += amountToCall;
    player.isActive = false;

    this.state.pot += amountToCall;
    this.state.numberOfActivePlayers -= 1;
  }

  handleRaise(player: PokerPlayer, amount: number) {
    if (amount <= this.state.minimumBet) {
      throw new Error('Raise amount must be greater than the minimum bet');
    }
    const fullBetAmount = this.state.currentBet + amount;
    const chipsToCall = fullBetAmount - player.bet;
    if (player.chips < chipsToCall) {
      throw new Error('Not enough chips');
    }

    player.chips -= chipsToCall;
    player.bet += chipsToCall;
    player.isActive = false;

    this.state.pot += chipsToCall;
    this.state.currentBet = fullBetAmount;
    this.state.numberOfActivePlayers -= 1;

    this.updateActivePlayers();
  }

  handleFold(player: PokerPlayer) {
    player.isFolded = true;
    player.isActive = false;

    this.state.numberOfPlayersToPlay -= 1;
    this.state.numberOfActivePlayers -= 1;
  }

  handleCheck(player: PokerPlayer) {
    if (this.state.currentBet > player.bet) {
      throw new Error('Cannot check, there is a bet to call');
    }

    player.isActive = false;

    this.state.numberOfActivePlayers -= 1;
  }

  handleAllIn(player: PokerPlayer) {
    if (player.isAllIn) {
      throw new Error('Player is already all in');
    }
    if (player.chips === 0) {
      throw new Error('Player has no chips to go all in');
    }

    player.bet += player.chips;
    player.isAllIn = true;
    player.isActive = false;
    player.chips = 0;

    this.state.pot += player.chips;
    this.state.currentBet = Math.max(player.bet, this.state.currentBet);
    this.state.numberOfActivePlayers -= 1;
  }

  nextPlayer() {
    if (this.state.gameOver || this.state.numberOfPlayersToPlay <= 1) {
      this.state.gameOver = true;
      return;
    }

    let currentPlayer: PokerPlayer;
    do {
      this.state.currentPlayerIndex =
        (this.state.currentPlayerIndex + 1) % this.state.players.length;
      currentPlayer = this.state.players[this.state.currentPlayerIndex];
    } while (!currentPlayer.isActive);
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

  chooseWinners() {
    const remainingPlayers = this.state.players.filter(
      (player) => !player.isFolded,
    );
    if (remainingPlayers.length === 0) {
      this.state.winners = null;
      return;
    }
    const sortedPlayers = remainingPlayers.sort((a, b) =>
      PokerHandCompare.compareHands(a.hand, this.state.communityCards, b.hand),
    );

    const winners = sortedPlayers.filter(
      (player) =>
        PokerHandCompare.compareHands(
          player.hand,
          this.state.communityCards,
          sortedPlayers[0].hand,
        ) === 0,
    );
    this.state.winners = winners;
  }

  updateChips() {
    if (this.state.winners) {
      const allInPlayers = this.state.players.filter(
        (player) => player.isAllIn && !player.isFolded,
      );
      if (allInPlayers.length > 0) {
        const allInPot = this.state.pot / allInPlayers.length;
        allInPlayers.forEach((player) => {
          const chipsWon = player.bet > allInPot ? allInPot : player.bet;
          player.chips += chipsWon;
          this.state.pot -= chipsWon;
        });
        const remainingPot = this.state.pot / this.state.winners.length;
        this.state.winners.forEach((winner) => {
          if (allInPlayers.includes(winner)) {
            return;
          }
          winner.chips += remainingPot;
          this.state.pot -= remainingPot;
        });
      }
    }
  }

  updateActivePlayers() {
    const activePlayers = this.state.players
      .filter((player) => !player.isFolded)
      .filter((player) => !player.isAllIn)
      .filter((player) => player.bet < this.state.currentBet);
    for (const player of activePlayers) {
      player.isActive = true;
    }
    this.state.numberOfActivePlayers = activePlayers.length;
  }
}
