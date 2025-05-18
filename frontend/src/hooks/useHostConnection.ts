import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { HostPayload, HostRoomData, PlayerAction } from "../types/RoomData";

export function useHostConnection(code: string) {
    const wsRef = useRef<Socket>();
    const [roomData, setRoomData] = useState<HostRoomData>({
        players: [{
            playerID: "player",
            chips: 100,
            currentBet: 200,
            isActive: true,
            isAllIn: false,
            isFolded: false
        }],
        currentPlayer: "player",
        potSize: 1000,
        cards: [{ rank: "A", suit: "club" }],
    });

    useEffect(() => {
        const ws = io("http://localhost:3000/ws/game", {
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

        ws.on("error", (err: unknown) => {
            console.error("[WebSocket] Error:", err);
        });

        ws.on("update-room", (data: HostPayload) => {
            setRoomData({ ...roomData, ...data.payload });
        });

        return () => {
            ws.disconnect();
        };
    }, [code]);

    const emitHostAction = (action: PlayerAction) => {
        wsRef.current?.emit("action", action);
    };

    const disconnect = () => {
        wsRef.current?.disconnect();
    };

    return {
        disconnect,
        emitHostAction,
        roomData
    };
}
