import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import GoHomeButton from '../components/GoHomeButton';
import CodeForm from '../components/CodeForm';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerJoinCodeScreen'>;

export default function PlayerJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <CodeForm title='Join as a Player' navigate={(code) => navigation.navigate("Player", { code })} />
    );
}

