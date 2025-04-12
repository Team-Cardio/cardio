import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerEntity } from './players.entity';
import { RoomEntity } from './room.entity';
import { generateCode } from './utils';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
    @InjectRepository(PlayerEntity)
    private playerRepository: Repository<PlayerEntity>,
  ) {}

  async create(): Promise<string> {
    const entity: Partial<RoomEntity> = {
      createdAt: new Date(),
      code: generateCode(),
    };
    const created = this.roomRepository.create(entity);
    await this.roomRepository.save(created);

    return created.code;
  }

  async join(playerId: number, code: string): Promise<boolean> {
    let player = await this.playerRepository.findOneBy({ id: playerId });
    const room = await this.roomRepository.findOneBy({ code });
    if (room == null) return false;

    if (player == null) {
      player = this.playerRepository.create({ room });
    } else {
      player.room = room;
    }
    this.playerRepository.save(player);

    return true;
  }

  async delete(code: string): Promise<boolean> {
    const room = await this.roomRepository.delete({ code });
    return room != null;
  }

  async getRoomPlayers(code: string): Promise<PlayerEntity[]> {
    const room = await this.roomRepository.findOne({
      where: { code },
      relations: ['players'],
    });
    if (room == null) return [];

    return room.players;
  }
}
