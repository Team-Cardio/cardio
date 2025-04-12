// auth.middleware.ts
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

export function createAuthMiddleware(jwtService: JwtService) {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        throw new Error('Authentication token missing');
      }
      const payload = jwtService.verify(token);
      socket.data.user = payload;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  };
}
