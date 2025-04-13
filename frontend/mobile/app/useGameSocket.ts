import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type GameSocket = Socket | null;

export function useGameSocket(isConnected: boolean) {
    const socketRef = useRef<GameSocket>(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (isConnected && !socketRef.current) {
            const socket = io('http://localhost:3000/ws/game', {
                transports: ['websocket'],
                path: '/socket.io',
              });
              
            socket.connect();


            socketRef.current = socket;

            socket.on('connect', () => {
                setConnected(true);
                console.log('[Socket] Connected to /ws/game');
            });

            socket.on('disconnect', () => {
                setConnected(false);
                console.log('[Socket] Disconnected');
            });

            socket.on('error', (err) => {
                console.error('[Socket] Error:', err);
            });

            return () => {
                socket.disconnect();
                socketRef.current = null;
                setConnected(false);
            };
        }

        if (!isConnected && socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setConnected(false);
        }
    }, [isConnected]);

    const emit = (event: string, payload: any) => {
        socketRef.current?.emit(event, payload);
      };

    const emitJoinRoom = (code: string, playerId: number) => {
        console.log('Emitting join-room event with code:', code, 'and playerId:', playerId);
        socketRef.current?.emit('join-room', { code, playerId });
    };

    const emitLeaveRoom = (code: string, playerId: number) => {
        socketRef.current?.emit('leave-room', { code, playerId });
    };

    const emitPlayerAction = (action: string, playerId: number, roomCode: string) => {
        socketRef.current?.emit('player-action', { action, playerId, roomCode });
    };

    const on = (event: string, callback: (...args: any[]) => void) => {
        socketRef.current?.on(event, callback);
    };

    const off = (event: string) => {
        socketRef.current?.off(event);
    };

    return {
        connected,
        emit,
        emitJoinRoom,
        emitLeaveRoom,
        emitPlayerAction,
        on,
        off,
    };
}
