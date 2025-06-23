import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { PlayerAction, PlayerPayload, PlayerRoomData } from "../types/RoomData";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from "react-native-toast-notifications"

export function usePlayerConnection(code: string) {
  const wsRef = useRef<Socket>();
  const [playerId, setPlayerId] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [roomData, setRoomData] = useState<PlayerRoomData>({
    playerID: "",
    isMyTurn: true,
    isActive: true,
    isAllIn: false,
    chips: 0,
    currentBet: 0,
    cards: [],
  });
  const toast = useToast();

  const savePlayerId = async (playerId: string) => {
    try {
      await AsyncStorage.setItem('playerId', JSON.stringify({ code, playerId }));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const loadPlayerId = async () => {
    try {
      const value = await AsyncStorage.getItem('playerId');
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        if (code === parsedValue.code) {
          setPlayerId(String(parsedValue.playerId));
        }
      }
      setIsLoaded(true);
    } catch (e) {
      console.error('Failed to load data', e);
    }
  };

  useEffect(() => { loadPlayerId() }, []);

  useEffect(() => {
    const ws = io(`${process.env.EXPO_PUBLIC_API_URL}/ws/game`, {
      transports: ["websocket"],
      path: "/socket.io",
    });
    wsRef.current = ws;

    ws.on("connect", () => {
      console.log(`[WebSocket] Connected ${playerId}`);

      if (playerId) {
        console.log(`join with playerId ${playerId}`)
        ws.emit("join-room", { code, playerId: Number(playerId) });
      } else {
        console.log(`joined without playerId ${playerId}`)
        ws.emit("join-room", { code });
      }
    });

    ws.on("disconnect", () => {
      console.log("[WebSocket] Disconnected");
    });

    ws.on("error", (err: { error: string }) => {
      toast.show(err.error, {
        type: "error",
        placement: "top",
        duration: 3000,
        animationType: "slide-in",
      });
      console.error("[WebSocket] Error:", err);
    });

    ws.on("joined", (data: PlayerPayload) => {
      setPlayerId(String(data.payload.playerID));
      savePlayerId(String(data.payload.playerID));
    });

    ws.on("update-room", (data: PlayerPayload) => {
      setRoomData({ ...roomData, ...data.payload });
    });

    return () => {
      ws.disconnect();
    };
  }, [code, isLoaded]);

  const emitPlayerAction = (action: PlayerAction) => {
    if (playerId == undefined) {
      console.error("[WebSocket] Player ID is undefined");
      return;
    }
    console.log(action, playerId)
    wsRef.current?.emit("action", { playerId: Number(playerId), action });
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
