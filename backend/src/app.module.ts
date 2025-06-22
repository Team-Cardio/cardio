import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RoomModule } from './room/room.module';

const passwd = process.env.REDIS_PASSWD;
const port = process.env.REDIS_PORT;

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRoot({
      type: 'single',
      url: `redis://:${passwd}@redis:${port}`,
    }),
    RoomModule,
  ],
})
export class AppModule {}
