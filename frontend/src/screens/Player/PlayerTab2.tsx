import React, { useCallback, useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PlayerTabParamList } from "@/src/types/navigation";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CardViewer from "@/src/components/CardViewer";
import ControllButton from "@/src/components/ControllButton";
import MoneyAmount from "@/src/components/MoneyAmount";
import { usePlayerConnection } from "@/src/hooks/usePlayerConnection";
import NumberInputModal from "@/src/components/AmountModal";
import Background from "@/src/components/Background";
import ChipsStacks from "@/src/components/ChipsStacks";

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
    emitPlayerAction({ type: "raise", amount });
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
    <Background source={require('@/assets/images/photo.jpg')}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.text}>Player {roomData.playerID} </Text>
          <Text style={styles.text}>Room code: {roomCode}</Text>
        </View>
        <View>
          {shouldShowWaitText && <Text style={styles.text}> Wait for other players</Text>}
          {roomData.isAllIn && <Text style={styles.text}> YOU ARE ALL IN! </Text>}
        </View>
        {!amountModalVisble ? <ChipsStacks value={amountModalVisble ? 0 : roomData.chips} /> : <View style={{
          flex: 1,
          alignItems: 'center',
        }} />}
        <MoneyAmount moneyAmount={roomData.chips} />
        <View style={styles.controll}>
          {shouldShowActionButtons && <ControllButton title="Fold" onPress={doFold} />}
          {shouldShowActionButtons && <ControllButton title="Call/Wait" onPress={doWait} />}
          {shouldShowActionButtons && <ControllButton title="Bet" onPress={() => setAmountModalVisible(true)} />}
        </View>
        <View style={styles.cardsContainer}>
          <CardViewer card={cards[0]} back="tcsDark" readyToShow={cards.length > 0} />
          <CardViewer card={cards[1]} back="tcsDark" readyToShow={cards.length > 0} />
        </View>
        <NumberInputModal isVisible={amountModalVisble} onClose={() => setAmountModalVisible(false)} onConfirm={doBet} />
      </GestureHandlerRootView>
    </Background>
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
    flexDirection: 'row',
    width: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 0,
  },
  text: {
    color: '#aaa',
    margin: 5,
    fontSize: 20,
  },
  buttons: {
    flexDirection: "row",
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
