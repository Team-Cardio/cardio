import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlayerEntity } from './players.entity';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @Column()
  code: string;

  @OneToMany(() => PlayerEntity, (player) => player.room)
  players: PlayerEntity[];
}
