import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import CodeForm from '../components/CodeForm';
import Background from '../components/Background';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerJoinCodeScreen'>;

export default function PlayerJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <Background source={require('@/assets/images/photo6.jpg')}>
            <CodeForm title='Join as a Player' navigate={(code) => navigation.navigate("Player", { code })} />
        </Background>
    );
}

