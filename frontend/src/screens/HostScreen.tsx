import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import GoHomeButton from '../components/GoHomeButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Host'>;

export default function HostScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Host Screen</Text>
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
    text: {
        fontSize: 24,
    },
});
