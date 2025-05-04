import { Card } from 'src/types/card';
import { Rank } from 'src/types/enums/card.enum';
import { PokerHandEval } from './poker-hand-eval';

export class PokerHandCompare {
  static compareHands(
    hand1: Card[],
    communityCards: Card[],
    hand2: Card[],
  ): number {
    const [pokerHand1, playerCards1] = PokerHandEval.evaluateHand(hand1, communityCards);
    const [pokerHand2, playerCards2] = PokerHandEval.evaluateHand(hand2, communityCards);

    if (pokerHand1 > pokerHand2) {
      return 1; // Hand 1 wins
    }
    if (pokerHand1 < pokerHand2) {
      return -1; // Hand 2 wins
    }
    // compare by player cards, already sorted by rank
    for (let i = 0; i < playerCards1.length; i++) {
      if (playerCards1[i].rank > playerCards2[i].rank) {
        return 1; // Hand 1 wins
      }
      if (playerCards1[i].rank < playerCards2[i].rank) {
        return -1; // Hand 2 wins
      }
    }
    return 0; // Tie
   
  }
}
