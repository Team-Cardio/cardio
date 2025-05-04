import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useWebSocket(code: string) {
  const wsRef = useRef<Socket>();
  const [playerId, setPlayerId] = useState<number>();
  const [roomData, setRoomData] = useState<any>({}); // TODO type

  useEffect(() => {
    const ws = io("http://localhost:3000/ws/game", {
      transports: ["websocket"],
      path: "/socket.io",
    });
    wsRef.current = ws;

    ws.on("connect", () => {
      console.log("[WebSocket] Connected");

      ws.emit("join-room", { code });
    });

    ws.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
    });

    ws.on("error", (err: unknown) => {
      console.error("[WebSocket] Error:", err);
    });

    ws.on("joined", (data: any) => {
      setPlayerId(data.payload.playerId);
    });

    ws.on("update-room", (data: any) => {
      setRoomData({ ...roomData, ...data.payload });
    });

    return () => {
      ws.disconnect();
    };
  }, [code]);

  const emitPlayerAction = (action: any) => {
    if (!playerId) {
      console.error("[WebSocket] Player ID is undefined");
      return;
    }
    wsRef.current?.emit("action", action);
  };

  const disconnect = () => {
    wsRef.current?.disconnect();
  };

  return {
    disconnect,
    emitPlayerAction,
    roomData
  };
}
