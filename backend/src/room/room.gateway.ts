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
    @MessageBody() data: { code: string; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Player ${data.playerId} is trying to join room ${data.code}`);
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

  @SubscribeMessage('bet')
  async handleBet(
    @MessageBody() data: { code: string; playerId: number; amount: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(
      `Player ${data.playerId} placed a bet of ${data.amount} in room ${data.code}`,
    );
    // Handle the bet logic here
    this.server
      .to(data.code)
      .emit('bet-update', { playerId: data.playerId, amount: data.amount });
  }

  // emitting events from the server to the client
  @SubscribeMessage('fold')
  async handleFold(
    @MessageBody() data: { code: string; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Player ${data.playerId} folded in room ${data.code}`);
    //Logic
    this.server.to(data.code).emit('fold-update', { playerId: data.playerId });
  }

  @SubscribeMessage('check')
  async handleCheck(
    @MessageBody() data: { code: string; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Player ${data.playerId} checked in room ${data.code}`);
    //Logic
    this.server.to(data.code).emit('check-update', { playerId: data.playerId });
  }
}
