import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from './const';
import { generateCode } from './utils';
import { EngineService } from 'src/engine/engine.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly engineService: EngineService 
) {}

  async create(): Promise<string> {
    const code = generateCode();

    const roomSetKey = REDIS.getRoomSetKey();
    const playerCounterKey = REDIS.getPlayerCounterKey();

    await this.redis.sadd(roomSetKey, code); // :((
    await this.redis.set(playerCounterKey, -1);

    this.engineService.createGame(code, 'poker')

    return code;
  }

  async join(code: string): Promise<number | null> {
    const roomKey = REDIS.getRoomKey(code);
    const playerCounterKey = REDIS.getPlayerCounterKey();
    
    // const roomExists = await this.redis.sismember(roomKey);
    // if (!roomExists) {
    //   return null;
    // }

    const playerId = await this.redis.incr(playerCounterKey);

    await this.redis.sadd(roomKey, playerId); // :((

    const playerRoomKey = REDIS.getPlayerRoomKey(playerId);
    await this.redis.set(playerRoomKey, code);

    return playerId;
  }

  async getRoomPlayers(code: string): Promise<number[]|null> {
    const roomKey = REDIS.getRoomKey(code);

    const playerKeys = await this.redis.smembers(roomKey);
    const playerIds = playerKeys.map((k) => Number(k)); // redis stores values as string

    return playerIds;
  }

  async getPlayerRoom(playerId: number): Promise<string | null> {
    const playerRoomKey = REDIS.getPlayerRoomKey(playerId);

    const roomCode = await this.redis.get(playerRoomKey);
    return roomCode;
  }
}
