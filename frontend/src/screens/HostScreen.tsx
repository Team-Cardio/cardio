import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/navigation";
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking";

import GoHomeButton from "@/src/components/GoHomeButton";
import CardViewer from "@/src/components/CardViewer";
import { Back } from "@/src/types/RoomData";
import { useHostConnection } from "../hooks/useHostConnection";
import PlayerBar from "../components/PlayerBar";
import Background from "../components/Background";
import ChipsStacks from "../components/ChipsStacks";
import MainButton from "../components/MainButton";

const Motive: Back = "tcsDark";

type Props = NativeStackScreenProps<RootStackParamList, "Host">;

export default function HostScreen({ route }: Props) {
  const roomCode = route.params.code;
  const { startGame, roomData } = useHostConnection(roomCode);
  const cards = roomData?.cards ?? [];

  console.log(cards);
  console.log(roomData.players);

  return (
    <Background source={require("@/assets/images/photo.jpg")}>
      <View style={styles.headerContainer}>
        <GoHomeButton title={"TABLE     Go home"} />
        <Text style={styles.text}>Room code: {roomCode}</Text>
      </View>
      <PlayerBar
        players={roomData?.players}
        curentPlayer={roomData.currentPlayer}
      />
      <View style={{ alignSelf: "center", marginBottom: 10 }}>
        <QRCode size={400} value={`myapp://app/player/${roomCode}`} />
      </View>
      <View style={styles.buttons}>
        {roomData.gameStarted || (
          <MainButton title="Start Game" onPress={startGame} />
        )}
      </View>
      <View style={styles.chips}>
        <Text style={styles.text}> POT: {roomData.potSize}</Text>
        <ChipsStacks value={roomData.potSize} />
      </View>
      <View style={styles.cards}>
        <View style={styles.cardsContainer}>
          <CardViewer
            card={cards[0]}
            back={Motive}
            readyToShow={cards.length > 0}
            shouldUseConstSize
            disable
          />
          <CardViewer
            card={cards[1]}
            back={Motive}
            readyToShow={cards.length > 1}
            shouldUseConstSize
            disable
          />
          <CardViewer
            card={cards[2]}
            back={Motive}
            readyToShow={cards.length > 2}
            shouldUseConstSize
            disable
          />
          <CardViewer
            card={cards[3]}
            back={Motive}
            readyToShow={cards.length > 3}
            shouldUseConstSize
            disable
          />
          <CardViewer
            card={cards[4]}
            back={Motive}
            readyToShow={cards.length > 4}
            shouldUseConstSize
            disable
          />
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    height: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderWidth: 0,
  },
  text: {
    color: "#aaa",
    margin: 5,
    fontSize: 20,
  },
  buttons: {
    alignSelf: "center",
  },
  startGame: {
    backgroundColor: "red",
    alignSelf: "center",
    padding: 5,
    borderRadius: 5,
  },
  chips: {
    flex: 1,
    alignItems: "center",
  },
  cards: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
    alignItems: "center",
  },
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  chipsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
