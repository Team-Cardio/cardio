import { Controller, Param, Post } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  async create(): Promise<string> {
    const code = this.roomService.create();

    console.log(`Created a room with code ${code}`);

    return code;
  }

  @Post('/join/:code')
  @ApiParam({ name: 'code', required: true, type: 'string' })
  async join(
    @Param() params: { code: string },
  ): Promise<{ success: boolean; playerId: number }> {
    const { code } = params;

    const playerId = Math.floor(Math.random() * 1000000); // Simulate a player ID for testing
    const success = await this.roomService.join(playerId, code);

    if (success) {
      console.log(`Joined room ${code}`);
    } else {
      console.log(`Failed joining room ${code}`);
    }

    return { success: success, playerId: playerId };
  }
}
