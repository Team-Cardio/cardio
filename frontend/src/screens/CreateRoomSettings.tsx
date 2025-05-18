import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import GoHomeButton from '../components/GoHomeButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRoomSettings'>;

export default function CreateRoomSettings({ navigation }: Props) {
    const [loading, setLoading] = useState(false);

    const createRoom = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('https://localhost:3000/room/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
            });

            if (!response.ok) {
                throw new Error('Nie udało się utworzyć pokoju');
            }

            const data = await response.json();
            const roomCode = data.roomCode;

            if (!roomCode) {
                throw new Error('Brak numeru pokoju w odpowiedzi');
            }

            navigation.navigate('Host', { code: roomCode.toString() });
        } catch (error: any) {
            Alert.alert('Błąd', error.message || 'Coś poszło nie tak');
        } finally {
            setLoading(false);
        }
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is a place for Room Settings</Text>

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Create Room" onPress={createRoom} />
            )}

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
        marginBottom: 20,
    },
});
