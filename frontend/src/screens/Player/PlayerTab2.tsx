import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PlayerTabParamList } from "@/src/types/navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import GoHomeButton from "@/src/components/GoHomeButton";
import CardViewer from "@/src/components/CardViewer";
import AddChipButton from "@/src/components/AddChipButton";
import SingleChip from "@/src/components/SingleChip";
import DraggableStack from "@/src/components/DraggableStack";
import ControllButton from "@/src/components/ControllButton";
import MoneyAmount from "@/src/components/MoneyAmount";
import { useWebSocket } from "@/src/hooks/useWebSocket";

const Chip1 = require("@/assets/images/chips/chip_1.png");
const Chip5 = require("@/assets/images/chips/chip_5.png");
const Chip25 = require("@/assets/images/chips/chip_25.png");

type Props = BottomTabScreenProps<PlayerTabParamList, "Tab2">;

const PlayerTab1 = ({ route }: Props) => {
  const roomCode = route.params.code;

  const { emitPlayerAction, roomData } = useWebSocket(roomCode);

  const doFold = () => {
    console.log("Fold");
    emitPlayerAction({ type: "fold" });
  };
  const doBet = (amount: number) => {
    console.log(`Bet ${amount}`);
    emitPlayerAction({ type: "bet", amount });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Player #</Text>
        <Text style={styles.text}>Room code: {roomCode}</Text>
      </View>
      <View style={styles.buttons}>
        <GoHomeButton />
        <AddChipButton />
      </View>
      <View style={styles.chipsContainer}>
        <DraggableStack image={Chip1} />
        <DraggableStack image={Chip5} />
        <DraggableStack image={Chip25} />
      </View>
      <View style={styles.controll}>
        <ControllButton title="Fold" onPress={doFold} />
        <MoneyAmount moneyAmount={5000} />
        <ControllButton title="Bet/Wait" onPress={() => doBet(10)} />
      </View>
      <View style={styles.cardsContainer}>
        <CardViewer suit="heart" rank="A" back="tcsDark" />
        <CardViewer suit="spade" rank="A" back="tcsDark" />
      </View>
    </GestureHandlerRootView>
  );
};

export default PlayerTab1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    height: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  text: {
    color: "gray",
    margin: 5,
    fontSize: 20,
  },
  buttons: {
    flexDirection: "row",
  },
  chipsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  controll: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  cardsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
});
