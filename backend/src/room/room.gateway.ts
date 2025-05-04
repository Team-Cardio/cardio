import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';

@WebSocketGateway({ namespace: '/ws/game', cors: true })
export class RoomGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    console.log('[Gateway] Client connected:', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('[Gateway] Client disconnected:', client.id);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    const playerId = await this.roomService.join(data.code);
    console.log(`Player ${playerId} has joined the room ${data.code}`);
    if (!playerId) {
      client.emit('error', 'Room not found');
      return;
    }

    client.join(data.code);
    client.emit('joined', { playerId });

    const players = await this.roomService.getRoomPlayers(data.code);
    this.server.to(data.code).emit('update-room', { players });
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() data: { playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const roomCode = await this.roomService.getPlayerRoom(data.playerId);
    if (!roomCode) {
      console.error("Player's room not found");
      return;
    }

    client.leave(roomCode);
    client.emit('left', { roomCode });

    const players = await this.roomService.getRoomPlayers(roomCode);
    this.server.to(roomCode).emit('update-room', { players });
  }

  @SubscribeMessage('action')
  async playMove(
    @MessageBody() data: { playerId: number; actionData?: any },
    @ConnectedSocket() client: Socket,
  ) {
    const roomCode = await this.roomService.getPlayerRoom(data.playerId);
    if (!roomCode) {
      console.error("Player's room not found");
      return;
    }

    // Handle the move logic here
    console.log(
      `Player ${data.playerId} played the move ${data.actionData.type} with ${data.actionData.amount}`,
    );

    this.server.to(roomCode).emit('update-room', {
      playerId: data.playerId,
      amount: data.actionData.amount,
    });
  }
}
