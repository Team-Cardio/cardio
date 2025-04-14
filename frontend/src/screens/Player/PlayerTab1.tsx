import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoHomeButton from '../../components/GoHomeButton'
import { PlayerTabParamList } from '@/src/types/navigation';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import ChipsViewer from '@/src/components/ChipsViewer';
import CardViewer from '@/src/components/CardsViewer';

const CardBackImage = require('@/assets/images/cards/back/back_2.png');
const Card2SpadeImage = require('@/assets/images/cards/front/spade-2.png');
const Card3HeartImage = require('@/assets/images/cards/front/heart-3.png');
const ChipsImage = require('@/assets/images/chips/chips.png');

type Props = BottomTabScreenProps<PlayerTabParamList, 'Tab1'>;

export default function PlayerTab1({ route }: Props) {
    const roomCode = route.params.code;
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.text}>Player Tab 1</Text>
                <Text style={styles.text}>Room code number {roomCode}</Text>
            </View>
            <View style={styles.chipsContainer}>
                <ChipsViewer imgSource={ChipsImage} />
            </View>
            <GoHomeButton />
            <View style={styles.cardsContainer}>
                <CardViewer imgSource={CardBackImage} />
                <CardViewer imgSource={Card3HeartImage} />
            </View>
        </View>
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
    },
    text: {
        color: 'gray',
        margin: 5,
        fontSize: 20,
    },
    chipsContainer: {
        flex: 1,
        width: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardsContainer: {
        flex: 1,
        width: 350,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
