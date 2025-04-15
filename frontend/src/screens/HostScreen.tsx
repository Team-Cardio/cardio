import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import GoHomeButton from '../components/GoHomeButton';
import CardViewer from '../components/CardViewer';
import ChipsViewer from '../components/ChipsViewer';

const CardBackImage = require('@/assets/images/cards/back/back_4.png');
const Card2SpadeImage = require('@/assets/images/cards/front/spade-2.png');
const Card3HeartImage = require('@/assets/images/cards/front/heart-3.png');
const Card10HeartImage = require('@/assets/images/cards/front/heart-10.png');
const CardAHeartImage = require('@/assets/images/cards/front/heart-A.png');
const CardASpadeImage = require('@/assets/images/cards/front/spade-A.png');

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
          <CardViewer frontImg={Card2SpadeImage} backImg={CardBackImage} />
          <CardViewer frontImg={CardAHeartImage} backImg={CardBackImage} />
          <CardViewer frontImg={Card10HeartImage} backImg={CardBackImage} />
          <CardViewer frontImg={Card3HeartImage} backImg={CardBackImage} />
          <CardViewer frontImg={CardASpadeImage} backImg={CardBackImage} />
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
