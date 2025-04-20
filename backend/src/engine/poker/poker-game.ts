import { Card } from 'src/types/card';
import { Color, Rank } from 'src/types/enums/card.enum';
import { GameEngine } from '../game-engine.interface';
import { gamePlayer } from '../utils/game-types';
import { PokerPlayer } from './poker-types';

export class PokerGame implements GameEngine {
    private players: PokerPlayer[] = [];
    private state: any = {};
  
    initialize(players: gamePlayer[]) {
      this.players = players.map((player) => ({
        ...player,
        chips: 1000,
        hand: [],
        bet: 0,
        isAllIn: false,
        isFolded: false,
      }));
        this.state = {
        players: this.players,
        pot: 0,
        communityCards: [],
        currentBet: 0,
        currentPlayerIndex: 0,
        round: 0,
        gameOver: false,
        winner: null,
        deck: this.createDeck(),
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
  
    processAction(playerId: number, action: string, payload?: any) {
      switch (action) {
        case 'bet':
          this.state.pot += payload.amount;
          break;
        case 'fold':
          // logic here
          break;
      }
    }
  
    getState() {
      return this.state;
    }
  }
  