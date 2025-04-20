import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import GoHomeButton from '../components/GoHomeButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRoomSettings'>;

export default function CreateRoomSettings({ navigation }: Props) {
    const createRoom = useCallback(() => {
        console.log("API should be called and Room code retrived")
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is a place for Room Settings</Text>
            <Button title="Create Room"
                onPress={() => { createRoom; navigation.navigate('Host', { code: "CODE FROM API" }) }} />

            <GoHomeButton />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 24,
    },
    desktopButtonContainer: {
        width: 300,
    },
});
