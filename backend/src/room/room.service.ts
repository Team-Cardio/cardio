import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from './const';
import { generateCode } from './utils';
import { EngineService } from 'src/engine/engine.service';
import { PokerGame } from 'src/engine/poker/poker-game';

@Injectable()
export class RoomService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly engineService: EngineService,
  ) {}

  async create(): Promise<string> {
    const code = generateCode();

    const roomSetKey = REDIS.getRoomSetKey();
    const playerCounterKey = REDIS.getPlayerCounterKey();

    await this.redis.sadd(roomSetKey, code); // :((
    await this.redis.set(playerCounterKey, -1);

    this.engineService.createGame(code, 'poker');

    return code;
  }

  async join(code: string, playerId?: number): Promise<any> {
    const roomKey = REDIS.getRoomKey(code);
    const playerCounterKey = REDIS.getPlayerCounterKey();

    const game = this.engineService.getGame(code);
    if (!game) {
      return { success: false, errorMsg: `Room ${code} does not exist` };
    }

    if (playerId === undefined) {
      playerId = await this.redis.incr(playerCounterKey);
      await this.redis.sadd(roomKey, playerId); // :((

      const playerRoomKey = REDIS.getPlayerRoomKey(playerId);
      await this.redis.set(playerRoomKey, code);

      game.addPlayer({ id: playerId, name: `Player: ${playerId}` });
    } else {
      const playersReady = game.setPlayerReady(playerId);
      if (playersReady === game.getPlayerCount()) {
        game.resumeGame();
      }
    }

    return {
      success: true,
      playerId,
    };
  }

  async leave(playerId: number): Promise<any> {
    const { success, game, roomCode } = await this.getPlayerGame(playerId);
    if (!success) {
      return { success };
    }

    game!.removePlayer(playerId);
    return { success, roomCode };
  }

  startGame(code: string) {
    const gameEngine = this.engineService.getGame(code);
    if (!gameEngine) {
      return { success: false, errorMsg: 'Game not found' };
    }
    if (gameEngine.getPlayerCount() < 2) {
      return {
        success: false,
        errorMsg: `Failed to start the game due to invalid number of players: ${gameEngine.getPlayerCount()}`,
      };
    }

    gameEngine.startGame();
    return { success: true };
  }

  nextRound(code: string) {
    const gameEngine = this.engineService.getGame(code);
    if (!gameEngine) {
      return { success: false, errorMsg: 'Game not found' };
    }
    gameEngine.newRound();
    return { success: true };
  }

  async performAction(playerId: number, action: any) {
    const { success, game, roomCode } = await this.getPlayerGame(playerId);
    if (!success) {
      return { success: false, errorMsg: 'Failed to find the game' };
    }

    try {
      game.processAction(playerId, action.type, action);
    } catch (e){
      return { success: false, errorMsg: `Failed to process the action: ${e}` };
    }

    console.log(
      `Player ${playerId} played the move ${action.type} with ${action.amount}`,
    );
    return { success: true, roomCode };
  }

  async getPlayerGame(
    playerId: number,
  ): Promise<{ success: boolean; game: any; roomCode: any }> {
    const playerRoomKey = REDIS.getPlayerRoomKey(playerId);

    const roomCode = await this.redis.get(playerRoomKey);
    if (!roomCode) {
      console.error('No room found');
      return { success: false, game: undefined, roomCode: undefined };
    }

    return { ...this.getGame(roomCode), roomCode };
  }

  getGame(roomCode: string): { success: boolean; game: any } {
    const game = this.engineService.getGame(roomCode);
    if (!game) {
      console.error('Failed to retrieve game');
      return { success: false, game: undefined };
    }

    return { success: true, game };
  }
}
