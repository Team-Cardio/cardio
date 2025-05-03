import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import CodeForm from '../components/CodeForm';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerJoinCodeScreen'>;

export default function PlayerJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <CodeForm title='Join as a Player' navigate={(code) => navigation.navigate("Player", { code })} />
    );
}

