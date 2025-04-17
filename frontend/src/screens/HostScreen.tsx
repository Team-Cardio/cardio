import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/src/types/navigation';

import GoHomeButton from '@/src/components/GoHomeButton';
import CardViewer from '@/src/components/CardViewer';
import ChipsViewer from '@/src/components/ChipsViewer';

const Chips = require('@/assets/images/chips/chips.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Host'>;

export default function PlayerTab1({ route }: Props) {
  const roomCode = route.params.code;
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.text}>TABLE</Text>
        <Text style={styles.text}>Room code: {roomCode}</Text>
      </View>
      <View style={styles.buttons}>
        <GoHomeButton />
      </View>
      <View style={styles.main}>
        <View style={styles.cardsContainer}>
          <CardViewer suit='heart' rank='2' back='tcs' />
          <CardViewer suit='spade' rank='7' back='tcs' />
          <CardViewer suit='diamond' rank='9' back='tcs' />
          <CardViewer suit='club' rank='5' back='tcs' />
          <CardViewer suit='club' rank='A' back='tcs' />
        </View>
        <View style={styles.chipsContainer}>
          <ChipsViewer imgSource={Chips} />
        </View>
      </View>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
  },
  main: {
    flexDirection: 'row',
    height: "100%",
  },
  cardsContainer: {
    flex: 2,
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
