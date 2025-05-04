import { gamePlayer } from '../utils/game-types';
import { Card } from 'src/types/card';

export type PokerPlayer = gamePlayer & {
  chips: number;
  hand: Card[];
  bet: number;
  isAllIn: boolean;
  isFolded: boolean;
};

export type InitialRoundState = {
  players: PokerPlayer[];
  blindAmount: number;
  roundNumber: number;
};

export type PokerRoundState = {
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
  blindPlayerIndex: number;
  blindAmount: number;
};

// The state of the game consisting of multiple rounds
export type PokerGameState = {
  players: PokerPlayer[];
  roundNumber: number;
  lastWinner: PokerPlayer | null;
  gameOver: boolean;
  roundHistory: PokerRoundState[];
  defaultBlindAmount: number;
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
