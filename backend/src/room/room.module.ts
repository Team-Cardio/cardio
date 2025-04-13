import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerEntity } from './players.entity';
import { RoomController } from './room.controller';
import { RoomEntity } from './room.entity';
import { RoomService } from './room.service';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, PlayerEntity])],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway],
  
})
export class RoomModule {}
