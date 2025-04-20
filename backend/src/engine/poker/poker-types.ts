import { gamePlayer } from "../utils/game-types";
import { Card } from "src/types/card";

export type PokerPlayer = gamePlayer & {
    chips: number;
    hand: Card[];
    bet: number;
    isAllIn: boolean;
    isFolded: boolean;
}

export type PokerGameState = {
    players: PokerPlayer[];
    pot: number;
    communityCards: Card[];
    currentBet: number;
    currentPlayerIndex: number;
    round: number;
    gameOver: boolean;
    winner: PokerPlayer | null;
    deck: Card[];
}