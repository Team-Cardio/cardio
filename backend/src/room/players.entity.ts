import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RoomEntity } from './room.entity';

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoomEntity, (room) => room.players, { cascade: true })
  room: RoomEntity;
}
