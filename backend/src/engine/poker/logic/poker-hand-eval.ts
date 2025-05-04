import { Card } from 'src/types/card';
import { Color, Rank } from 'src/types/enums/card.enum';
import { PokerHand } from '../poker-types';

export class PokerHandEval {
  static evaluateHand(hand: Card[], communityCards: Card[]): [PokerHand, Card[]] {
    const allCards = [...hand, ...communityCards];
    return this.getHandRank(allCards);
  }

  private static getHandRank(cards: Card[]): [PokerHand, Card[]] {
    const isFlush = this.isFlush(cards);
    const isStraight = this.isStraight(cards);

    if (isFlush && isStraight) {
      for(const color in Color)
      {
        const oneColorCards = cards.filter((card) => card.color === color)

      }
    }

    const rankCount = new Map<Rank, {cnt: number, rank: Rank}>();
    for (const card of cards) {
      rankCount.set(card.rank, {cnt: (rankCount.get(card.rank)?.cnt || 0 ) + 1, rank: card.rank});
    }
    const counts = Array.from(rankCount.values()).sort((a, b) => {
      if (a.cnt === b.cnt) {
        return b.rank - a.rank;
      }
      return b.cnt - a.cnt;
    }
    );

    const isFourOfAKind = counts[0].cnt === 4;
    const isFullHouse = counts[0].cnt === 3 && counts[1].cnt >= 2;
    const isThreeOfAKind = counts[0].cnt === 3 && counts[1].cnt === 1;
    const isTwoPair = counts[0].cnt === 2 && counts[1].cnt === 2;
    const isOnePair = counts[0].cnt === 2 && counts[1].cnt === 1;

    if (isFourOfAKind) {
      const four = cards.filter((card) => card.rank === counts[0].rank);
      const kicker = cards.filter((card) => card.rank !== counts[0].rank).sort(
        (a, b) => b.rank - a.rank,
      )[0];
      return [PokerHand.FourOfAKind, [...four, kicker]];
    }
    if (isFullHouse) {
      const three = cards.filter((card) => card.rank === counts[0].rank);
      const pair = cards.filter((card) => card.rank === counts[1].rank).slice(0, 2); 
      return [PokerHand.FullHouse, [...three, ...pair]];
    }
    if (isFlush) {
      return PokerHand.Flush;
    }
    if (isStraight) {
      return PokerHand.Straight;
    }
    if (isThreeOfAKind) {
      const three = cards.filter((card) => card.rank === counts[0].rank);
      const kicker1 = cards.filter((card) => card.rank === counts[1].rank);
      const kicker2 = cards.filter((card) => card.rank === counts[2].rank);
      return [PokerHand.ThreeOfAKind, [...three, ...kicker1, ...kicker2]];
    }
    if (isTwoPair) {
      const pair1 = cards.filter((card) => card.rank === counts[0].rank);
      const pair2 = cards.filter((card) => card.rank === counts[1].rank);
      const kicker = cards.filter((card) => card.rank !== counts[0].rank && card.rank !== counts[1].rank).sort(
        (a, b) => b.rank - a.rank,
      )[0];
      return [PokerHand.TwoPair, [...pair1, ...pair2, kicker]];
    }
    if (isOnePair) {
      const pair = cards.filter((card) => card.rank === counts[0].rank);
      const kickers = cards.filter((card) => card.rank !== counts[0].rank).sort(
        (a, b) => b.rank - a.rank,
      ).slice(0, 3);
      return [PokerHand.OnePair, [...pair, ...kickers]];
    }

    return [PokerHand.HighCard, cards.sort((a, b) => b.rank - a.rank).slice(0, 5)];
  }

  private static isStraight(cards: Card[]): boolean {
    const ranks = cards.map((card) => card.rank).sort((a, b) => a - b);
    const consecutiveCount = ranks.reduce((count, rank, index) => {
      if (index === 0) return count;
      return rank === ranks[index - 1] + 1 ? count + 1 : count;
    }, 1);
      
    return true;
  }

  private static isFlush(cards: Card[]): [boolean, Color?] {
    const counts: Record<Color, number> = {
      [Color.SPADE]: 0,
      [Color.HEART]: 0,
      [Color.DIAMOND]: 0,
      [Color.CLUB]: 0,
    };

    for (const card of cards) {
      if (++counts[card.color] >= 5) return [true, card.color]
    }
  
    return [false, undefined]
  }
}
