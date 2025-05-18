import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PlayerTabParamList } from "@/src/types/navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import GoHomeButton from "@/src/components/GoHomeButton";
import CardViewer from "@/src/components/CardViewer";
import DraggableStack from "@/src/components/DraggableStack";
import ControllButton from "@/src/components/ControllButton";
import MoneyAmount from "@/src/components/MoneyAmount";
import { usePlayerConnection } from "@/src/hooks/usePlayerConnection";
import NumberInputModal from "@/src/components/AmountModal";

const Chip1 = require("@/assets/images/chips/monte_carlo/chip_1.png");
const Chip5 = require("@/assets/images/chips/monte_carlo/chip_5.png");
const Chip25 = require("@/assets/images/chips/monte_carlo/chip_25.png");

type Props = BottomTabScreenProps<PlayerTabParamList, "Tab2">;

const PlayerTab2 = ({ route }: Props) => {
  const [amountModalVisble, setAmountModalVisible] = useState<boolean>(false);
  const roomCode = route.params.code;

  const { emitPlayerAction, roomData } = usePlayerConnection(roomCode);
  const cards = roomData.cards;

  const doFold = useCallback(() => {
    console.log("Fold");
    emitPlayerAction({ type: "fold" });
  }, [emitPlayerAction]);
  const doBet = useCallback((amount: number) => {
    console.log(`Bet ${amount}`);
    emitPlayerAction({ type: "bet", amount });
  }, [emitPlayerAction]);
  const doWait = useCallback(() => {
    console.log("Wait");
    if (roomData.currentBet > 0) {
      emitPlayerAction({ type: 'call' });
    } else {
      emitPlayerAction({ type: 'check' });
    }
  }, [emitPlayerAction]);

  const shouldShowWaitText = !roomData.isMyTurn && !roomData.isAllIn;
  const shouldShowActionButtons = roomData.isMyTurn && roomData.isActive;

  return (<>
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>Player {roomData.playerID} </Text>
        <Text style={styles.text}>Room code: {roomCode}</Text>
      </View>
      <View style={styles.buttons}>
        <GoHomeButton />
      </View>
      <View>
        {shouldShowWaitText && <Text style={styles.text}> Wait for other players</Text>}
        {roomData.isAllIn && <Text style={styles.text}> YOU ARE ALL IN! </Text>}
      </View>
      <View style={styles.chipsContainer}>
        {!amountModalVisble && (
          <>
            < DraggableStack image={Chip1} />
            <DraggableStack image={Chip5} />
            <DraggableStack image={Chip25} />
          </>
        )}
      </View>
      <View style={styles.controll}>
        {shouldShowActionButtons && <ControllButton title="Fold" onPress={doFold} />}
        <MoneyAmount moneyAmount={roomData.chips} />
        {shouldShowActionButtons && <ControllButton title="Bet" onPress={() => setAmountModalVisible(true)} />}
      </View>
      {shouldShowActionButtons && <ControllButton title="Call/Wait" onPress={doWait} />}
      <View style={styles.cardsContainer}>
        <CardViewer card={cards[0]} back="tcsDark" readyToShow={cards.length > 0} />
        <CardViewer card={cards[1]} back="tcsDark" readyToShow={cards.length > 0} />
      </View>
      <NumberInputModal isVisible={amountModalVisble} onClose={() => setAmountModalVisible(false)} onConfirm={doBet} />
    </GestureHandlerRootView>
  </>
  );
};

export default PlayerTab2;

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
