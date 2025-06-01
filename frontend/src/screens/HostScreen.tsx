import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types/navigation';

import GoHomeButton from '@/src/components/GoHomeButton';
import CardViewer from '@/src/components/CardViewer';
import { Back } from '@/src/types/RoomData';
import DraggableStack from '../components/DraggableStack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useHostConnection } from '../hooks/useHostConnection';
import PlayerBar from '../components/PlayerBar';

const Chip1 = require('@/assets/images/chips/monte_carlo/chip_1.png');
const Chip5 = require('@/assets/images/chips/monte_carlo/chip_5.png');
const Chip25 = require('@/assets/images/chips/monte_carlo/chip_25.png');
const Motive: Back = 'tcsDark';

type Props = NativeStackScreenProps<RootStackParamList, 'Host'>;

export default function HostScreen({ route }: Props) {
  const roomCode = route.params.code;
  const { startGame, roomData } = useHostConnection(roomCode);
  const cards = roomData?.cards ?? [];

  console.log(cards)
  console.log(roomData.players)

  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>TABLE</Text>
        <Text style={styles.text}>Room code: {roomCode}</Text>
      </View>
      <PlayerBar players={roomData?.players} curentPlayer={roomData.currentPlayer} />
      <View style={styles.buttons}>
        <GoHomeButton />
        {roomData.gameStarted || (
          <Pressable onPress={startGame} style={{backgroundColor: 'red', alignSelf:'center'}}>
            <Text>Start game</Text>
          </Pressable>
        )}
      </View>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.text}>POT: {roomData.potSize}</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.cardsContainer}>
          <CardViewer card={cards[0]} back={Motive} readyToShow={cards.length > 0} shouldUseConstSize disable />
          <CardViewer card={cards[1]} back={Motive} readyToShow={cards.length > 1} shouldUseConstSize disable />
          <CardViewer card={cards[2]} back={Motive} readyToShow={cards.length > 2} shouldUseConstSize disable />
          <CardViewer card={cards[3]} back={Motive} readyToShow={cards.length > 3} shouldUseConstSize disable />
          <CardViewer card={cards[4]} back={Motive} readyToShow={cards.length > 4} shouldUseConstSize disable />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "80%",
  },
  headerContainer: {
    height: 40,
    flexDirection: 'row',
    width: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  text: {
    color: 'gray',
    margin: 5,
    fontSize: 20,
  },
  buttons: {
    alignSelf: 'center',
  },
  main: {
    flexDirection: 'row',
    height: "100%",
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
