import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://localhost:' + (process.env.REDIS_PORT ?? '6379'),
    }),
    RoomModule,
  ],
})
export class AppModule {}
