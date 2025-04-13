import { Injectable } from "@nestjs/common";
import { Server } from "socket.io";
import { Card } from "src/types/card";

@Injectable()
export class RoomPublisher {
    private server: Server;

  setServer(server: Server) {
    this.server = server;   
    }

  emitToRoom(roomCode: string, event: string, payload: any) {
    this.server.to(roomCode).emit(event, payload);
  }

  emitToPlayer(roomCode: string, playerId: number, event: string, payload: any) {
    this.server.to(`player-${playerId}`).emit(event, payload);
  }

  revealCard(roomCode: string, card: Card) {
    this.emitToRoom(roomCode, 'card-revealed', {card});
  }

  dealHands(roomCode: string, playerId: number, cards: Card[]) {
    this.emitToPlayer(roomCode, playerId, 'deal-hand', {cards});
  }

  newRound(roomCode: string, roundData: any) {
    this.emitToRoom(roomCode, 'new-round', roundData);
  }

  playerAnswered(roomCode: string, playerId: number) {
    this.emitToRoom(roomCode, 'player-answered', { playerId });
  }

  roundResults(roomCode: string, results: any[]) {
    this.emitToRoom(roomCode, 'round-results', { results });
  }

  gameOver(roomCode: string, leaderboard: any) {
    this.emitToRoom(roomCode, 'game-over', { leaderboard });
  }
}
