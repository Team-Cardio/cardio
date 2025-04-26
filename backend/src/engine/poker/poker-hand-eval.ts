import { Card } from 'src/types/card';
import { Rank } from 'src/types/enums/card.enum';
import { PokerHand } from './poker-types';

export class PokerHandEval {
  static evaluateHand(hand: Card[], communityCards: Card[]): PokerHand {
    const allCards = [...hand, ...communityCards];
    const handRank = this.getHandRank(allCards);
    return handRank;
  }

  private static getHandRank(cards: Card[]): PokerHand {
    const isFlush = this.isFlush(cards);
    const isStraight = this.isStraight(cards);

    if (isFlush && isStraight) {
      if (cards.some((card) => card.rank === Rank.ACE)) {
        return 'RoyalFlush';
      }
      return 'StraightFlush';
    }

    const rankCount = new Map<Rank, number>();
    for (const card of cards) {
      rankCount.set(card.rank, (rankCount.get(card.rank) || 0) + 1);
    }
    const counts = Array.from(rankCount.values()).sort((a, b) => b - a);
    const isFourOfAKind = counts[0] === 4;
    const isFullHouse = counts[0] === 3 && counts[1] === 2;
    const isThreeOfAKind = counts[0] === 3 && counts[1] === 1;
    const isTwoPair = counts[0] === 2 && counts[1] === 2;
    const isOnePair = counts[0] === 2 && counts[1] === 1;

    if (isFourOfAKind) {
      return 'FourOfAKind';
    }
    if (isFullHouse) {
      return 'FullHouse';
    }
    if (isFlush) {
      return 'Flush';
    }
    if (isStraight) {
      return 'Straight';
    }
    if (isThreeOfAKind) {
      return 'ThreeOfAKind';
    }
    if (isTwoPair) {
      return 'TwoPair';
    }
    if (isOnePair) {
      return 'OnePair';
    }

    return 'HighCard';
  }

  private static isStraight(cards: Card[]): boolean {
    const ranks = cards.map((card) => card.rank).sort((a, b) => a - b);
    for (let i = 0; i < ranks.length - 1; i++) {
      if (ranks[i] + 1 !== ranks[i + 1]) {
        return false;
      }
    }
    return true;
  }

  private static isFlush(cards: Card[]): boolean {
    const colorCount = Array.from(
      new Set(cards.map((card) => card.color)),
    ).length;
    return colorCount === 1;
  }
}
