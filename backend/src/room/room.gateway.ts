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

  socketMap: Map<number, Socket>;

  constructor(
    private readonly roomService: RoomService,
    private readonly engineService: EngineService,
  ) {
    this.socketMap = new Map();
  }

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

    this.sendRoomUpdate(data.code, []);
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
    client.emit('joined', { payload: { playerID: playerId } });

    this.socketMap.set(playerId, client);

    this.sendRoomUpdate(data.code, []);
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

    this.sendRoomUpdate(roomCode, []);
  }

  @SubscribeMessage('start-game')
  async handleStartGame(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    const players = await this.roomService.getRoomPlayers(data.code);
    if (players?.length !== 2) {
      console.error(
        `Failed to start the game due to invalid number of players: ${players?.length}`,
      );
      return;
    }

    // this.engineService.createGame(
    //   data.code,
    //   'poker',
    //   players!.map((p) => ({ name: 'xd', id: p })),
    // );

    const gameEngine = this.engineService.getGame(data.code);
    if (!gameEngine) {
      console.error('Game not found');
      return;
    }
    gameEngine.startGame();
    gameEngine.newRound();

    this.sendRoomUpdate(data.code, [...this.socketMap.keys()]);
  }

  @SubscribeMessage('action')
  async playMove(
    @MessageBody() data: { playerId: number; action?: any },
    @ConnectedSocket() client: Socket,
  ) {
    const roomCode = await this.roomService.getPlayerRoom(data.playerId);
    if (!roomCode) {
      console.error(`Player's room not found ${data.playerId}`);
      return;
    }

    // Handle the move logic here
    console.log(
      `Player ${data.playerId} played the move ${data.action.type} with ${data.action.amount}`,
    );

    const gameEngine = this.engineService.getGame(roomCode);
    if (!gameEngine) {
      console.error('Failed to retrieve game');
      return;
    }
    gameEngine.processAction(data.playerId, data.action.type, data.action);

    this.sendRoomUpdate(roomCode, [...this.socketMap.keys()]);
  }

  private sendRoomUpdate(code: string, playerIds: number[]) {
    const state = this.getRoomState(code, playerIds);
    this.server
      .to(`${code}_spectate`)
      .emit('update-room', { payload: state?.host });
    for (const p of state?.players ?? []) {
      this.socketMap.get(p.playerID)?.emit('update-room', { payload: p });
    }
  }

  private getRoomState(roomCode: string, playerIds: number[]) {
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

    let playerData: any[] = [];
    for (const pid of playerIds) {
      const myPlayerIndex = gameEngine.getPlayerIdx(pid);
      const myPlayer = players[myPlayerIndex!];
      playerData.push({
        ...myPlayer,
        isMyTurn: gameState.round?.currentPlayerIndex == myPlayerIndex,
        cards: gameState.game.players[0].hand.map((x) => ({
          suit: x.color,
          rank: x.rank,
        })),
      });
    }
    return {
      host: {
        players,
        currentPlayer: gameState.round?.currentPlayerIndex,
        potSize: gameState.game.chipsInPlay,
        cards: gameState.round?.communityCards,
      },
      players: playerData,
    };
  }
}
