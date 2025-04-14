import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoHomeButton from '../../components/GoHomeButton'
import { PlayerTabParamList } from '@/src/types/navigation';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import ChipsViewer from '@/src/components/ChipsViewer';
import CardViewer from '@/src/components/CardViewer';
import AddChipButton from '@/src/components/AddChipButton';
import Chip from '@/src/components/Chip';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const CardBackImage = require('@/assets/images/cards/back/back_4.png');
const Card2SpadeImage = require('@/assets/images/cards/front/spade-2.png');
const Card3HeartImage = require('@/assets/images/cards/front/heart-3.png');
const ChipsImage = require('@/assets/images/chips/chips.png');

const Chip1 = require('@/assets/images/chips/chip_1.png');
const Chip5 = require('@/assets/images/chips/chip_5.png');
const Chip25 = require('@/assets/images/chips/chip_25.png');

type Props = BottomTabScreenProps<PlayerTabParamList, 'Tab1'>;

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
                {/* <ChipsViewer imgSource={ChipsImage} /> */}
                <Chip chipSource={Chip5}/>
                <Chip chipSource={Chip25}/>
                <Chip chipSource={Chip25}/>
            </View>
            <View style={styles.cardsContainer}>
                <CardViewer frontImg={Card2SpadeImage} backImg={CardBackImage} />
                <CardViewer frontImg={Card3HeartImage} backImg={CardBackImage} />
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
    },
    cardsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: "1%",
        paddingHorizontal: 8,
    },
});
