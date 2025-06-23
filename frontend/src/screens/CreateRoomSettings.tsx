import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import GoHomeButton from '../components/GoHomeButton';
import Background from '../components/Background';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateRoomSettings'>;

export default function CreateRoomSettings({ navigation }: Props) {
    const [loading, setLoading] = useState(false);

    const createRoom = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/room/create`, {
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
            const roomCode = data.code;

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
        <Background source={require('@/assets/images/photo4.jpg')}>
          <View style={styles.container}>
              <Text style={styles.text}>This is a place for Room Settings</Text>

              {loading ? (
                  <ActivityIndicator size="large" />
              ) : (
                  <Button title="Create Room" onPress={createRoom} />
              )}

              <GoHomeButton />
          </View>
        </Background>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    margin: 20,
    color: 'white',
  },
});
