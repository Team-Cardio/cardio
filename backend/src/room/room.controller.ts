import { Controller, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { RoomService } from './room.service';

// TODO: get rid of REST api

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('/create')
  async create(): Promise<{ statusCode: HttpStatus; code: string }> {
    const code = await this.roomService.create();

    if (!code) {
      console.error('Failed to create a room');
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code: '',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      code,
    };
  }

  @Post('/join/:code')
  @ApiParam({ name: 'code', required: true, type: 'string' })
  async join(
    @Param() params: { code: string },
  ): Promise<{ statusCode: HttpStatus; code: string }> {
    const { code } = params;

    const playerId = await this.roomService.join(code);

    if (playerId == null) {
      console.error(`Failed joining room ${code}`);
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        code,
      };
    }

    console.log(`Joined room ${code}`);
    return {
      statusCode: HttpStatus.OK,
      code,
    };
  }
}
