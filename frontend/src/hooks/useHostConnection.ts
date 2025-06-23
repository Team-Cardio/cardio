import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { HostPayload, HostRoomData, PlayerAction } from "../types/RoomData";
import { useToast } from "react-native-toast-notifications";

export function useHostConnection(code: string) {
    const wsRef = useRef<Socket>();
    const toast = useToast();
    const [roomData, setRoomData] = useState<HostRoomData>({
        players: [],
        currentPlayer: "",
        potSize: 0,
        cards: [],
        gameStarted: false
    });

    useEffect(() => {
        const ws = io(`${process.env.EXPO_PUBLIC_API_URL}/ws/game`, {
            transports: ["websocket"],
            path: "/socket.io",
        });
        wsRef.current = ws;

        ws.on("connect", () => {
            console.log("[WebSocket] Connected");

            ws.emit("spectate", { code });
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

        ws.on("update-room", (data: HostPayload) => {
            setRoomData({ ...roomData, ...data.payload });
        });

        return () => {
            ws.disconnect();
        };
    }, [code]);

    const startGame = () => {
        wsRef.current?.emit("start-game", { code });
    };

    const disconnect = () => {
        wsRef.current?.disconnect();
    };

    return {
        disconnect,
        startGame,
        roomData
    };
}
