import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PlayerTabParamList } from '@/src/types/navigation';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import GoHomeButton from '@/src/components/GoHomeButton'
import CardViewer from '@/src/components/CardViewer';
import AddChipButton from '@/src/components/AddChipButton';
import DraggableStack from '@/src/components/DraggableStack';
import ControllButton from '@/src/components/ControllButton';
import MoneyAmount from '@/src/components/MoneyAmount';

const Chip1 = require('@/assets/images/chips/monte_carlo/chip_1.png');
const Chip5 = require('@/assets/images/chips/monte_carlo/chip_5.png');
const Chip25 = require('@/assets/images/chips/monte_carlo/chip_25.png');

type Props = BottomTabScreenProps<PlayerTabParamList, 'Tab2'>;

export default function PlayerTab1({ route }: Props) {
  const roomCode = route.params.code;
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
      <DraggableStack image={Chip1}/>
        <DraggableStack image={Chip5}/>
        <DraggableStack image={Chip25}/>
      </View>
      <View style={styles.controll}>
        <ControllButton title="Fold" onPress={()=>{const i = 0;}} />
        <MoneyAmount moneyAmount={5000}/>
        <ControllButton title="Bet/Wait" onPress={()=>{const i = 0;}} />
      </View>
      <View style={styles.cardsContainer}>
        <CardViewer suit='heart' rank='A' back='tcsDark' />
        <CardViewer suit='spade' rank='A' back='tcsDark' />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
  },
  chipsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  controll: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  cardsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
