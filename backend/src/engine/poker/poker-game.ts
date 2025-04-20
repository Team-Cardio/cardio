import { GameEngine } from '../game-engine.interface';

export class PokerGame implements GameEngine {
    private players: any[] = [];
    private state: any = {};
  
    initialize(players: any[]) {
      this.players = players;
      this.state = {
        round: 1,
        pot: 0,
        hands: {},
      };
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
  