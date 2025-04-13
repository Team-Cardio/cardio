import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useGameSocket } from "./useGameSocket";

const apiPath = "http://localhost:3000/room/";

export default function Index() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [playerId, setPlayerId] = useState<number | null>(null);

  const {
    connected,
    emitJoinRoom,
    emitLeaveRoom,
    emit, // generic emitter for new events
    on,
    off,
  } = useGameSocket(isConnected);

  // Helper to add log messages to state.
  const addLog = (message: string) => {
    setLogs((prev) => [message, ...prev]);
  };

  const createRoom = async () => {
    try {
      const response = await fetch(apiPath + "create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.text();
      addLog(`Room created with code: ${data}`);
      setRoomCode(data);
    } catch (error) {
      console.error("Error creating room:", error);
      addLog(`Error creating room: ${error}`);
    }
  };

  const joinRoom = async (roomCode: string) => {
    try {
      const response = await fetch(apiPath + "join/" + roomCode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const { success, playerId } = data;
      addLog(`Joined room via API with code: ${success}`);
      setPlayerId(playerId);
      addLog(`Player ID: ${playerId}`);
      setIsConnected(true);
    } catch (error) {
      console.error("Error joining room:", error);
      addLog(`Error joining room: ${error}`);
    }
  };

  // Function to send a bet. Amount is hardcoded to 100 for testing.
  const sendBet = () => {
    if (roomCode) {
      const betPayload = { code: roomCode, playerId: playerId, amount: 100 };
      addLog(`Emitting bet: ${JSON.stringify(betPayload)}`);
      emit("bet", betPayload);
    } else {
      addLog("Cannot bet: no room code available");
    }
  };

  // Function to send a fold.
  const sendFold = () => {
    if (roomCode) {
      const foldPayload = { code: roomCode, playerId: playerId };
      addLog(`Emitting fold: ${JSON.stringify(foldPayload)}`);
      emit("fold", foldPayload);
    } else {
      addLog("Cannot fold: no room code available");
    }
  };

  // Function to send a check.
  const sendCheck = () => {
    if (roomCode) {
      const checkPayload = { code: roomCode, playerId: playerId };
      addLog(`Emitting check: ${JSON.stringify(checkPayload)}`);
      emit("check", checkPayload);
    } else {
      addLog("Cannot check: no room code available");
    }
  };

  // When connected and a room exists, emit the join-room event.
  useEffect(() => {
    if (isConnected && roomCode) {
      addLog(`Emitting join-room event with code: ${roomCode}`);
      emitJoinRoom(roomCode, 1); // Replace 1 with the actual playerId if needed.
    }
  }, [isConnected, roomCode]);

  // Socket event listeners.
  useEffect(() => {
    on("joined", ({ roomCode }) => {
      addLog(`Successfully joined socket room: ${roomCode}`);
    });
    on("left", ({ roomCode }) => {
      addLog(`Left room: ${roomCode}`);
    });
    on("room-update", ({ players }) => {
      addLog(`Room players updated: ${JSON.stringify(players)}`);
    });
    on("bet-update", ({ playerId, amount }) => {
      addLog(`Bet update received: player ${playerId} bet ${amount}`);
    });
    on("fold-update", ({ playerId }) => {
      addLog(`Fold update received: player ${playerId} folded`);
    });
    on("check-update", ({ playerId }) => {
      addLog(`Check update received: player ${playerId} checked`);
    });
    on("error", (err) => {
      addLog(`Socket error: ${err}`);
    });
    return () => {
      off("joined");
      off("left");
      off("room-update");
      off("bet-update");
      off("fold-update");
      off("check-update");
      off("error");
    };
  }, [on, off]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View
        style={{
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, marginBottom: 10 }}>Room Controller</Text>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>
          {roomCode ? `Room Code: ${roomCode}` : "No room created yet"}
        </Text>
        <TouchableOpacity
          onPress={() => {
            const code = prompt("Enter room code:");
            if (code) {
              setRoomCode(code);
              addLog(`Room code set to: ${code}`);
            }
          }}
          style={{ marginBottom: 20 }}
        >
          <Text style={{ fontSize: 18, color: "blue" }}>Set Room Code</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={createRoom}>
          <Text style={{ fontSize: 18, color: "blue" }}>Create Room</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setRoomCode(null);
            addLog("Room code cleared");
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={{ fontSize: 18, color: "red" }}>Clear Room Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (roomCode) {
              joinRoom(roomCode);
            } else {
              addLog("No room code to join");
            }
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={{ fontSize: 18, color: "green" }}>Join Room</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 20, alignItems: "center" }}>
        <TouchableOpacity onPress={sendBet}>
          <Text style={{ fontSize: 18, color: "purple" }}>Send Bet (100)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={sendFold} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: "orange" }}>Fold</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={sendCheck} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, color: "teal" }}>Check</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Logs:</Text>
        <ScrollView style={{ backgroundColor: "#eee", padding: 10 }}>
          {logs.map((log, index) => (
            <Text key={index} style={{ marginBottom: 5 }}>
              {log}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
