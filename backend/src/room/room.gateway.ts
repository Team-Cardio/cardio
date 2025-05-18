import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { EngineService } from 'src/engine/engine.service';

@WebSocketGateway({ namespace: '/ws/game', cors: true })
export class RoomGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly roomService: RoomService,
    private readonly engineService: EngineService,
  ) {}

  handleConnection(client: Socket) {
    console.log('[Gateway] Client connected:', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('[Gateway] Client disconnected:', client.id);
  }

  @SubscribeMessage('spectate')
  async handleSpectateRoom(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`${data.code}_spectate`);
    client.emit('joined');

    this.sendRoomUpdate(data.code);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    const playerId = await this.roomService.join(data.code);
    console.log(`Player ${playerId} has joined the room ${data.code}`);
    if (playerId == undefined) {
      client.emit('error', 'Room not found');
      return;
    }
    this.engineService
      .getGame(data.code)!
      .addPlayer({ id: playerId, name: `Player: ${playerId}` });

    client.join(data.code);
    client.emit('joined', { playerId });

    this.sendRoomUpdate(data.code);
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

    this.sendRoomUpdate(roomCode);
  }

  @SubscribeMessage('start-game')
  async handleStartGame(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    const players = await this.roomService.getRoomPlayers(data.code);
    if (players?.length !== 2) {
      console.error(
        'Failed to start the game due to invalid number of players',
      );
      return;
    }

    // this.engineService.createGame(
    //   data.code,
    //   'poker',
    //   players!.map((p) => ({ name: 'xd', id: p })),
    // );

    this.engineService.getGame(data.code)?.startGame();

    this.sendRoomUpdate(data.code);
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

    const gameEngine = this.engineService.getGame(roomCode);
    if (!gameEngine) {
      console.error('Failed to retrieve game');
      return;
    }
    gameEngine.processAction(
      data.playerId,
      data.actionData.type,
      data.actionData,
    );

    this.sendRoomUpdate(roomCode, data.playerId);
  }

  private sendRoomUpdate(code: string, playerId?: number) {
    const state = this.getRoomState(code, playerId);
    this.server.to(code).emit('update-room', { data: state?.player });
    this.server
      .to(`${code}_spectate`)
      .emit('update-room', { data: state?.host });
  }

  private getRoomState(roomCode: string, playerId?: number) {
    const gameEngine = this.engineService.getGame(roomCode);
    if (!gameEngine) {
      console.error('Failed to retrieve the game');
      return;
    }
    const gameState = gameEngine.getState();

    const players = gameState.game.players.map((p) => ({
      playerID: p.id,
      chips: p.chips,
      currentBet: p.bet,
      isAllIn: p.isAllIn,
      isFolded: !p.isActive && !p.isAllIn,
      isActive: p.isActive,
    }));

    let playerData: any = undefined;
    if (playerId != undefined && gameState.round) {
      const myPlayerIndex = gameEngine.getPlayerIdx(playerId);
      const myPlayer = players[myPlayerIndex!];
      playerData = {
        ...myPlayer,
        isMyTurn: gameState.round.currentPlayerIndex == myPlayerIndex,
        cards: gameState.game.players[myPlayerIndex!].hand,
      };
    }

    return {
      host: {
        players,
        currentPlayer: gameState.round?.currentPlayerIndex,
        potSize: gameState.game.chipsInPlay,
        cards: gameState.round?.communityCards,
      },
      player: playerData,
    };
  }
}
