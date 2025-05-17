import { Card, Color, Rank } from 'src/types/card';
import { PokerHand, RankEval, CardEval } from '../poker-types';

export class PokerHandEval {
  static evaluateHand(
    hand: Card[],
    communityCards: Card[],
  ): [PokerHand, Card[]] {
    const allCards = [...hand, ...communityCards];
    // duplicate all aces into the ACE_HIGH and convert
    const allConvertedCards = allCards.map((card) => {
      if (card.rank === Rank.ACE) {
        return [
          {
            color: card.color,
            rank: RankEval.ACE as unknown as RankEval,
          } as CardEval,
          {
            color: card.color,
            rank: RankEval.ACE_HIGH as unknown as RankEval,
          } as CardEval,
        ];
      }
      return {
        color: card.color,
        rank: card.rank as unknown as RankEval,
      } as CardEval; // i dont like this
    });
    const res = this.getHandRank(allConvertedCards.flat());
    // convert the cards back to the original rank

    const convertedCards = res[1].map((card) => {
      if (card.rank === RankEval.ACE) {
        return { color: card.color, rank: Rank.ACE } as Card;
      }
      if (card.rank === RankEval.ACE_HIGH) {
        return { color: card.color, rank: Rank.ACE } as Card;
      }
      return { color: card.color, rank: card.rank as unknown as Rank } as Card;
    });
    return [res[0], convertedCards];
  }

  private static getHandRank(cards: CardEval[]): [PokerHand, CardEval[]] {
    const [isFlush, flushColor] = this.isFlush(cards);
    const [isStraight, straightHighCard] = this.isStraight(cards);

    if (isFlush && isStraight) {
      const flushCards = cards.filter((card) => card.color === flushColor);
      const [isStraightFlush, straightFlushHighCard] =
        this.isStraight(flushCards);
      if (isStraightFlush) {
        const straightFlushCards = flushCards
          .filter((card) => card.rank <= straightFlushHighCard!.rank)
          .sort((a, b) => b.rank - a.rank)
          .slice(0, 5);
        return [PokerHand.StraightFlush, straightFlushCards];
      }
    }

    const rankCount = new Map<RankEval, { cnt: number; rank: RankEval }>();
    for (const card of cards) {
      rankCount.set(card.rank, {
        cnt: (rankCount.get(card.rank)?.cnt || 0) + 1,
        rank: card.rank,
      });
    }
    const counts = Array.from(rankCount.values()).sort((a, b) => {
      if (a.cnt === b.cnt) {
        return b.rank - a.rank;
      }
      return b.cnt - a.cnt;
    });

    const isFourOfAKind = counts[0].cnt === 4;
    const isFullHouse = counts[0].cnt === 3 && counts[1].cnt >= 2;
    const isThreeOfAKind = counts[0].cnt === 3;
    const isTwoPair = counts[0].cnt === 2 && counts[1].cnt === 2;
    const isOnePair = counts[0].cnt === 2;

    if (isFourOfAKind) {
      const four = cards.filter((card) => card.rank === counts[0].rank);
      const kicker = cards
        .filter((card) => card.rank !== counts[0].rank)
        .sort((a, b) => b.rank - a.rank)[0];
      return [PokerHand.FourOfAKind, [...four, kicker]];
    }
    if (isFullHouse) {
      const three = cards.filter((card) => card.rank === counts[0].rank);
      const pair = cards
        .filter((card) => card.rank === counts[1].rank)
        .slice(0, 2);
      return [PokerHand.FullHouse, [...three, ...pair]];
    }
    if (isFlush) {
      const flushCards = cards
        .filter((card) => card.color === flushColor)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 5);
      return [PokerHand.Flush, flushCards];
    }
    if (isStraight) {
      const straightCards = cards
        .filter((card) => card.rank <= straightHighCard!.rank)
        // remove same rank cards (can be different colors)
        .filter((card, index, self) => {
          return index === self.findIndex((c) => c.rank === card.rank);
        })
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 5);
      return [PokerHand.Straight, straightCards];
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
      const kicker = cards
        .filter(
          (card) =>
            card.rank !== counts[0].rank && card.rank !== counts[1].rank,
        )
        .sort((a, b) => b.rank - a.rank)[0];
      return [PokerHand.TwoPair, [...pair1, ...pair2, kicker]];
    }
    if (isOnePair) {
      const pair = cards.filter((card) => card.rank === counts[0].rank);
      const kickers = cards
        .filter((card) => card.rank !== counts[0].rank)
        .sort((a, b) => b.rank - a.rank)
        .slice(0, 3);
      return [PokerHand.OnePair, [...pair, ...kickers]];
    }

    return [
      PokerHand.HighCard,
      cards.sort((a, b) => b.rank - a.rank).slice(0, 5),
    ];
  }

  private static isStraight(cards: CardEval[]): [boolean, CardEval?] {
    const ranks = cards.map((card) => card.rank).sort((a, b) => a - b);
    const consecutiveCount = ranks.reduce(
      (acc, rank, index) => {
        if (index === 0) return { count: 1, maxCount: 1 };

        if (rank === ranks[index - 1] + 1) {
          const newCount = acc.count + 1;
          return {
            count: newCount,
            maxCount: Math.max(acc.maxCount, newCount),
            rank: acc.maxCount >= 5 ? ranks[index] : acc.rank,
          };
        }
        return {
          count: 1,
          maxCount: Math.max(acc.maxCount, acc.count),
          rank: acc.rank,
        };
      },
      { count: 0, maxCount: 0, rank: RankEval.ACE },
    );

    const isStraight = consecutiveCount.maxCount >= 5;
    const highCard = isStraight
      ? cards.find((card) => card.rank === consecutiveCount.rank)
      : undefined;

    return [isStraight, highCard];
  }

  private static isFlush(cards: CardEval[]): [boolean, Color?] {
    const counts: Record<Color, number> = {
      [Color.SPADE]: 0,
      [Color.HEART]: 0,
      [Color.DIAMOND]: 0,
      [Color.CLUB]: 0,
    };

    for (const card of cards) {
      if (++counts[card.color] >= 5) return [true, card.color];
    }

    return [false, undefined];
  }
}
