import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from './room.service';
import { getCardRankName } from './utils';

@WebSocketGateway({ namespace: '/ws/game', cors: true })
export class RoomGateway {
  @WebSocketServer() server: Server;

  socketMap: Map<number, Socket>;
  playerMap: Map<Socket, number>;

  constructor(private readonly roomService: RoomService) {
    this.socketMap = new Map();
    this.playerMap = new Map();
  }

  handleConnection(client: Socket) {
    console.log('[Gateway] Client connected:', client.id);
  }
  async handleDisconnect(client: Socket) {
    console.log('[Gateway] Client disconnected:', client.id);
    const playerId = this.playerMap.get(client);
    if (!playerId) return;
    const {success, game, roomCode} = await this.roomService.getPlayerGame(playerId);
    if (!success) return;

    game.disconnectPlayer(playerId);
    this.sendRoomUpdate(roomCode);
  }

  @SubscribeMessage('spectate')
  async handleSpectateRoom(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`${data.code}_spectate`);
    client.emit('joined');

    client.emit('update-room', { payload: this.getRoomState(data.code)?.host });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() data: { code: string; playerId?: number },
    @ConnectedSocket() client: Socket,
  ) {
    const {
      playerId,
      success,
      errorMsg,
    } = await this.roomService.join(data.code, data.playerId);

    this.socketMap.set(playerId, client);
    this.playerMap.set(client, playerId);

    if (!success) {
      client.emit('error', { error: errorMsg });
      console.error('error while joining');
      return;
    }

    client.emit('joined', { payload: { playerID: playerId } });
    this.sendRoomUpdate(data.code);
  }

  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @MessageBody() data: { playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { success, roomCode } = await this.roomService.leave(data.playerId);
    if (!success) {
      console.error("Player's room not found");
      return;
    }

    this.socketMap.delete(data.playerId);
    this.playerMap.delete(client);

    client.emit('left', { roomCode });
    this.sendRoomUpdate(roomCode);
  }

  @SubscribeMessage('ready')
  async handleReady(
    @MessageBody() data: { code: string; playerId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { success, game } = this.roomService.getGame(data.code);
    if (!success) {
      const errorMsg = 'Room not found';
      console.error(errorMsg);
      client.emit(errorMsg);
      return;
    }

    const playersReady = game.setPlayerReady(data.playerId);
    if (playersReady === game.getPlayerCount()) {
      game.startGame();
    }
  }

  @SubscribeMessage('start-game')
  async handleStartGame(
    @MessageBody() data: { code: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { success, errorMsg } = this.roomService.startGame(data.code);
    if (!success) {
      console.error(errorMsg);
      client.emit('error', { error: errorMsg });
      return;
    }

    this.sendRoomUpdate(data.code);
  }

  @SubscribeMessage('action')
  async playMove(
    @MessageBody() data: { playerId: number; action?: any },
    @ConnectedSocket() client: Socket,
  ) {
    const { success, errorMsg, roomCode } =
      await this.roomService.performAction(data.playerId, data.action);
    if (!success) {
      console.error(errorMsg);
      client.emit('error', { error: errorMsg });
      return;
    }

    this.sendRoomUpdate(roomCode);
  }

  private sendRoomUpdate(code: string) {
    const state = this.getRoomState(code);
    this.server
      .to(`${code}_spectate`)
      .emit('update-room', { payload: state?.host });
    for (const p of state?.players ?? []) {
      this.socketMap.get(p.playerID)?.emit('update-room', { payload: p });
    }
  }

  private getRoomState(roomCode: string) {
    const { success, game } = this.roomService.getGame(roomCode);
    if (!success) {
      console.error('Failed to retrieve the game');
      return;
    }
    const { game: gameState, round: roundState } = game.getState();

    const playersPublic = gameState.players.map((p) => ({
      playerID: p.id,
      name: p.name,
      chips: p.chips,
      currentBet: p.bet,
      isAllIn: p.isAllIn,
      isFolded: !p.isActive && !p.isAllIn,
      isActive: p.isActive,
    }));

    let playerData: any[] = [];
    for (let playerIdx = 0; playerIdx < gameState.players.length; ++playerIdx) {
      playerData.push({
        ...playersPublic[playerIdx],

        isMyTurn: roundState?.currentPlayerIndex == playerIdx,
        cards: gameState.players[playerIdx].hand.map((card) => ({
          suit: card.color,
          rank: getCardRankName(card.rank),
        })),
      });
    }

    return {
      host: {
        players: playersPublic,
        currentPlayer: roundState?.currentPlayerIndex,
        potSize: gameState.chipsInPlay,
        cards: roundState?.communityCards.map((card) => ({
          suit: card.color,
          rank: getCardRankName(card.rank),
        })),
        gameStarted: gameState.gameActive,
      },
      players: playerData,
    };
  }
}
