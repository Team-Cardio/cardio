import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import CodeForm from '../components/CodeForm';
import Background from '../components/Background';

type Props = NativeStackScreenProps<RootStackParamList, 'HostJoinCodeScreen'>;

export default function HostJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <Background source={require('@/assets/images/photo7.avif')}>
            <CodeForm title='Rejoin as a Host' navigate={(code) => navigation.navigate("Host", { code })} />
        </Background>
    );
}

