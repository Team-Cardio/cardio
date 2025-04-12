import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoHomeButton from '../../components/GoHomeButton'
import { PlayerTabParamList } from '@/src/types/navigation';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

type Props = BottomTabScreenProps<PlayerTabParamList, 'Tab1'>;

export default function PlayerTab1({ route }: Props) {
    const roomCode = route.params.code;
    return (
        <View style={styles.container}>
            <Text>Player Tab 1</Text>
            <Text style={{ padding: 10 }}>Room code number {roomCode}</Text>
            <GoHomeButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
