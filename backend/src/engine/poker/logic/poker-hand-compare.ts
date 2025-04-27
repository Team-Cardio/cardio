import { Card } from 'src/types/card';
import { Rank } from 'src/types/enums/card.enum';
import { PokerHandEval } from './poker-hand-eval';

export class PokerHandCompare {
  static compareHands(
    hand1: Card[],
    communityCards: Card[],
    hand2: Card[],
  ): number {
    const pokerHand1 = PokerHandEval.evaluateHand(hand1, communityCards);
    const pokerHand2 = PokerHandEval.evaluateHand(hand2, communityCards);

    if (pokerHand1 > pokerHand2) {
      return 1; // Hand 1 wins
    }
    if (pokerHand1 < pokerHand2) {
      return -1; // Hand 2 wins
    }
    const rankCount1 = this.getCardDistribution(hand1, communityCards);
    const rankCount2 = this.getCardDistribution(hand2, communityCards);

    const ranks1 = Array.from(rankCount1.keys());
    const ranks2 = Array.from(rankCount2.keys());
    const counts1 = Array.from(rankCount1.values());
    const counts2 = Array.from(rankCount2.values());

    // compare the counts first
    for (let i = 0; i < Math.min(counts1.length, counts2.length); i++) {
      if (counts1[i] > counts2[i]) {
        return 1; // Hand 1 wins
      }
      if (counts1[i] < counts2[i]) {
        return -1; // Hand 2 wins
      }
    }
    // If counts are equal, compare the ranks
    for (let i = 0; i < Math.min(ranks1.length, ranks2.length); i++) {
      if (ranks1[i] > ranks2[i]) {
        return 1; // Hand 1 wins
      }
      if (ranks1[i] < ranks2[i]) {
        return -1; // Hand 2 wins
      }
    }
    return 0; // Tie
  }

  static getCardDistribution(
    hand: Card[],
    communityCards: Card[],
  ): Map<Rank, number> {
    const allCards = [...hand, ...communityCards];
    const rankCount = new Map<Rank, number>();
    for (const card of allCards) {
      rankCount.set(card.rank, (rankCount.get(card.rank) || 0) + 1);
    }

    const sortedRankCount = new Map(
      [...rankCount.entries()].sort((a, b) => {
        if (a[1] === b[1]) {
          return b[0] - a[0]; // Sort by rank in descending order if counts are equal
        }
        return b[1] - a[1]; // Sort by count in descending order
      }),
    );

    return sortedRankCount;
  }
}
