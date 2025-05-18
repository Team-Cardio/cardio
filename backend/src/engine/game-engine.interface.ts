export interface GameEngine {
  initialize(players: any[]): void;
  processAction(playerId: number, action: string, payload?: any): void;
  getState(): any;
}
