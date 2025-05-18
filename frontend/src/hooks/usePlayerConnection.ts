import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { PlayerAction, PlayerPayload, PlayerRoomData } from "../types/RoomData";

export function usePlayerConnection(code: string) {
  const wsRef = useRef<Socket>();
  const [playerId, setPlayerId] = useState<string>();
  const [roomData, setRoomData] = useState<PlayerRoomData>({
    playerID: "",
    isMyTurn: true,
    isActive: true,
    isAllIn: false,
    chips: 0,
    currentBet: 0,
    cards: [],
  });

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

    ws.on("joined", (data: PlayerPayload) => {
      setPlayerId(data.payload.playerID);
    });

    ws.on("update-room", (data: PlayerPayload) => {
      setRoomData({ ...roomData, ...data.payload });
    });

    return () => {
      ws.disconnect();
    };
  }, [code]);

  const emitPlayerAction = (action: PlayerAction) => {
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
