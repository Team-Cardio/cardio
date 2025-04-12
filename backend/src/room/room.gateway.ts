import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "./room.service";


@WebSocketGateway({ namespace: '/ws/game', cors: true })
export class GameGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly roomService: RoomService) {}

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { code: string; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomExists = await this.roomService.join(data.playerId, data.code);
    if (!roomExists) {
      client.emit('error', 'Room not found');
      return;
    }

    client.join(data.code);
    client.emit('joined', { roomCode: data.code });

    const players = await this.roomService.getRoomPlayers(data.code);
    this.server.to(data.code).emit('room-update', { players });
  }

  @SubscribeMessage('player-action')
  handlePlayerAction(
    @MessageBody() data: { action: string; playerId: number; roomCode: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { action, playerId, roomCode } = data;

    // Broadcast the action to all players in the room
    this.server.to(roomCode).emit('player-action', { action, playerId });
  }
  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() data: { code: string; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(data.code);
    client.emit('left', { roomCode: data.code });

    const players = await this.roomService.getRoomPlayers(data.code);
    this.server.to(data.code).emit('room-update', { players });
  }
}