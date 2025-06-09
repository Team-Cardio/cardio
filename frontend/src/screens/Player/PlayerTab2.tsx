import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { PlayerTabParamList } from "@/src/types/navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CardViewer from "@/src/components/CardViewer";
import DraggableStack from "@/src/components/DraggableStack";
import ControllButton from "@/src/components/ControllButton";
import MoneyAmount from "@/src/components/MoneyAmount";
import { usePlayerConnection } from "@/src/hooks/usePlayerConnection";
import NumberInputModal from "@/src/components/AmountModal";
import { useSharedValue } from "react-native-reanimated";
import ChipCalculator from "@/src/components/ChipsCalculator";

const Chip1 = require("@/assets/images/chips/monte_carlo/chip_1.png");
const Chip5 = require("@/assets/images/chips/monte_carlo/chip_5.png");
const Chip25 = require("@/assets/images/chips/monte_carlo/chip_25.png");
const Chip50 = require("@/assets/images/chips/monte_carlo/chip_50.png");
const Chip100 = require("@/assets/images/chips/monte_carlo/chip_100.png");

type Props = BottomTabScreenProps<PlayerTabParamList, "Tab2">;

const PlayerTab2 = ({ route }: Props) => {
  const [amountModalVisble, setAmountModalVisible] = useState<boolean>(false);
  const roomCode = route.params.code;

  const count100 = useSharedValue(0);
  const count50 = useSharedValue(0);
  const count25 = useSharedValue(0);
  const count5 = useSharedValue(0);
  const count1 = useSharedValue(0);

  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey(prev => prev + 1);

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
      <ImageBackground
      source={require('@/assets/images/photo.jpg')}
      resizeMode="cover"
      style={styles.background}
    >
      {/* <View style={styles.headerContainer}>
        <Text style={styles.text}>Player {roomData.playerID} </Text>
        <Text style={styles.text}>Room code: {roomCode}</Text>
      </View>  */}
      <View>
        {shouldShowWaitText && <Text style={styles.text}> Wait for other players</Text>}
        {roomData.isAllIn && <Text style={styles.text}> YOU ARE ALL IN! </Text>}
      </View>
      <ChipCalculator
        count100={count100}
        count50={count50}
        count25={count25}
        count5={count5}
        count1={count1}
        onRefresh={refresh}
      />
      <View style={styles.chipsContainer} key={refreshKey}>
        {!amountModalVisble && (
          <>
            <DraggableStack image={Chip100} amount={count100.value} position={2}/>
            <DraggableStack image={Chip50} amount={count50.value} position={1}/>
            <DraggableStack image={Chip25} amount={count25.value} position={0}/>
            <DraggableStack image={Chip5} amount={count5.value} position={-1}/>
            <DraggableStack image={Chip1} amount={count1.value} position={-2}/>
          </>
        )}
      </View>
      <MoneyAmount moneyAmount={roomData.chips} />
      <View style={styles.controll}>
        {shouldShowActionButtons && <ControllButton title="FOLD" onPress={doFold} />}
        {shouldShowActionButtons && <ControllButton title="CALL/WAIT" onPress={doWait} />}
        {shouldShowActionButtons && <ControllButton title="BET" onPress={() => setAmountModalVisible(true)} />}
      </View>
      <View style={styles.cardsContainer}>
        <CardViewer card={cards[0]} back="tcsDark" readyToShow={cards.length > 0} />
        <CardViewer card={cards[1]} back="tcsDark" readyToShow={cards.length > 0} />
      </View>
      <NumberInputModal isVisible={amountModalVisble} onClose={() => setAmountModalVisible(false)} onConfirm={doBet} />
        </ImageBackground>
    </GestureHandlerRootView>
  </>
  );
};

export default PlayerTab2;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: "center",
  },
  container: {
    flex: 1,
    position: 'relative',
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
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});
