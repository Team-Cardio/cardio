import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private roomRepository: Repository<RoomEntity>,
  ) {}

  async create(): Promise<string> {
    const entity: Omit<RoomEntity, 'id'> = {
      name: 'test1',
      code: 'xyz'
    }
    const created = this.roomRepository.create(entity);
    await this.roomRepository.save(created)

    return created.code;
  }

  async join(code: string): Promise<boolean> {
    const room = await this.roomRepository.findOneBy({code});
    return  room != null;
  }

  async delete(code: string): Promise<boolean> {
    const room = await this.roomRepository.delete({code});
    return  room != null;
  }
}
