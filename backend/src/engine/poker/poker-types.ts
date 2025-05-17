import { gamePlayer } from '../utils/game-types';
import { Card } from 'src/types/card';

export type PokerPlayer = gamePlayer & {
  chips: number;
  hand: Card[];
  bet: number;
  isAllIn: boolean;
  isFolded: boolean;
  isActive: boolean;
};

export type InitialRoundState = {
  players: PokerPlayer[];
  bigBlindAmount: number;
  roundNumber: number;
  dealerIndex: number;
  leftoverPot: number;
};

export type PokerRoundState = {
  roundPhase: PokerRoundStateEnum;
  players: PokerPlayer[];
  pot: number;
  communityCards: Card[];
  currentBet: number;
  currentPlayerIndex: number;
  currentRound: number;
  gameOver: boolean;
  winner: PokerPlayer | null;
  deck: Card[];
  numberOfPlayersToPlay: number;
  numberOfActivePlayers: number;
  dealerIndex: number;
  bigBlindAmount: number;
  smallBlindAmount: number;
  minimumBet: number;
};

// The state of the game consisting of multiple rounds
export type PokerGameState = {
  players: PokerPlayer[];
  roundNumber: number;
  lastWinner: PokerPlayer | null;
  gameOver: boolean;
  roundHistory: PokerRoundState[];
  defaultBlindAmount: number;
  chipsInPlay: number;
};

export type PokerGameAction = 'call' | 'raise' | 'fold' | 'check' | 'allIn';

export enum PokerHand {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush,
}

export enum PokerRoundStateEnum {
  PreFlop,
  Flop,
  Turn,
  River,
  Showdown,
}
