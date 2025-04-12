import React from 'react';
import { View, Button, StyleSheet, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { width } = useWindowDimensions();
    const isNarrow = width < 768;

    return (
        <View style={styles.container}>
            <View style={[styles.buttonContainer, isNarrow ? {} : styles.desktopButtonContainer]}>
                <Button title="Host" onPress={() => navigation.navigate('Host')} />
            </View>
            <View style={[styles.buttonContainer, isNarrow ? {} : styles.desktopButtonContainer]}>
                <Button title="Player" onPress={() => navigation.navigate('PlayerInviteCode')} />
            </View>
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
    buttonContainer: {
        width: '80%',
        marginBottom: 20,
    },
    desktopButtonContainer: {
        width: 300,
    },
});
